import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import { useFacet } from "@/lib/facet";
import type { AtUri, DidPlc, DidWeb } from "@/lib/types/atproto";
import { systemsGmstnDevelopmentChannelInviteRecordSchema } from "@/lib/types/lexicon/systems.gmstn.development.channel.invite";
import { partition } from "@/lib/utils/arrays";
import { getCommitFromFullAtUri, stringToAtUri } from "@/lib/utils/atproto";
import { addMembership } from "@/lib/utils/gmstn";
import { useMemberships } from "@/providers/authed/MembershipsProvider";
import {
    useOAuthAgentGuaranteed,
    useOAuthSessionGuaranteed,
} from "@/providers/OAuthProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { useConstellationInvitesQuery } from "@/queries/hooks/useConstellationInvitesQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Mail, MailOpen, X } from "lucide-react-native";
import { FlatList, Pressable, View } from "react-native";
import { z } from "zod";

export const Invites = () => {
    const { semantic } = useCurrentPalette();
    const { atoms, typography } = useFacet();
    const { memberships } = useMemberships();
    const session = useOAuthSessionGuaranteed();
    const { useQuery } = useConstellationInvitesQuery(session);

    const { data: invites, isLoading } = useQuery();

    console.log(invites);

    const membershipAtUris: Array<Required<AtUri>> = memberships
        .map((membershipRecord) => {
            const res = stringToAtUri(membershipRecord.membership.invite.uri);
            if (!res.ok) return;
            return res.data as Required<AtUri>;
        })
        .filter((membership) => membership !== undefined);

    const [existingInvites, pendingInvites] = partition(
        invites?.invites ?? [],
        (invite) =>
            membershipAtUris.some(
                (membership) => invite.rkey === membership.rKey,
            ),
    );

    console.log({ existingInvites, pendingInvites });

    return (
        <View
            style={{
                flex: 1,
                flexDirection: "column",
                padding: 32,
                gap: 16,
                alignItems: "center",
            }}
        >
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: semantic.borderVariant,
                            borderRadius: atoms.radii.lg,
                            padding: 12,
                            paddingVertical: 16,
                            gap: 16,
                            width: "50%",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginLeft: 6,
                                gap: 6,
                            }}
                        >
                            <Mail
                                height={20}
                                width={20}
                                color={semantic.text}
                            />
                            <Text
                                style={[
                                    typography.weights.byName.medium,
                                    typography.sizes.xl,
                                ]}
                            >
                                Pending Invites
                            </Text>
                        </View>
                        <FlatList
                            contentContainerStyle={{ gap: 4 }}
                            data={pendingInvites}
                            renderItem={({ item: invite }) => (
                                <PendingInvite
                                    inviteAtUri={{
                                        authority: invite.did as
                                            | DidPlc
                                            | DidWeb,
                                        collection: invite.collection,
                                        rKey: invite.rkey,
                                    }}
                                />
                            )}
                        />
                    </View>
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: semantic.borderVariant,
                            borderRadius: atoms.radii.lg,
                            padding: 12,
                            paddingVertical: 16,
                            gap: 16,
                            width: "50%",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginLeft: 6,
                                gap: 6,
                            }}
                        >
                            <MailOpen
                                height={20}
                                width={20}
                                color={semantic.text}
                            />
                            <Text
                                style={[
                                    typography.weights.byName.medium,
                                    typography.sizes.xl,
                                ]}
                            >
                                Existing Invites
                            </Text>
                        </View>
                        <FlatList
                            data={existingInvites}
                            renderItem={({ item: invite }) => (
                                <View>
                                    <Text>{invite.rkey}</Text>
                                </View>
                            )}
                        />
                    </View>
                </>
            )}
        </View>
    );
};

const PendingInvite = ({ inviteAtUri }: { inviteAtUri: Required<AtUri> }) => {
    const { semantic } = useCurrentPalette();
    const { atoms } = useFacet();
    const session = useOAuthSessionGuaranteed();
    const agent = useOAuthAgentGuaranteed();
    const { queryKey: constellationInvitesQueryKey } =
        useConstellationInvitesQuery(session);
    const queryClient = useQueryClient();

    const queryKeysToInvalidate = constellationInvitesQueryKey.concat([
        "membership",
        session.did,
    ]);

    const { mutate: mutateInvites, error: inviteMutationError } = useMutation({
        mutationFn: async (state: "accepted" | "rejected") => {
            const inviteCommitRes = await getCommitFromFullAtUri(inviteAtUri);
            if (!inviteCommitRes.ok)
                throw new Error(
                    "Could not resolve invite record from user's PDS.",
                );
            const { data: inviteCommit } = inviteCommitRes;

            const {
                success: parseSuccess,
                error: parseError,
                data: inviteRecordParsed,
            } = systemsGmstnDevelopmentChannelInviteRecordSchema.safeParse(
                inviteCommit.value,
            );
            if (!parseSuccess)
                throw new Error(
                    `Could not validate invite record schema. ${z.prettifyError(parseError)}`,
                );

            const { uri, cid } = inviteCommit;
            if (!cid)
                throw new Error(
                    "Invite commit record did not have a cid somehow. Ensure that the data on PDS is not malformed.",
                );

            const creationResult = await addMembership({
                agent,
                membershipInfo: {
                    channel: inviteRecordParsed.channel,
                    invite: {
                        cid,
                        uri,
                    },
                    state,
                },
            });

            if (!creationResult.ok)
                throw new Error(
                    `Error when submitting data. Check the inputs. ${creationResult.error}`,
                );
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: queryKeysToInvalidate,
            });
        },
        onError: () => {
            // TODO: handle error
        },
    });

    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Text>{inviteAtUri.rKey}</Text>
            <Pressable
                style={{ marginLeft: 2 }}
                onPress={() => {
                    mutateInvites("accepted");
                }}
            >
                {({ hovered }) => (
                    <Check
                        height={16}
                        width={16}
                        color={semantic.positive}
                        style={{
                            backgroundColor: hovered
                                ? semantic.surfaceVariant
                                : semantic.surface,
                            padding: 4,
                            borderRadius: atoms.radii.sm,
                        }}
                    />
                )}
            </Pressable>
            <Pressable
                style={{ marginLeft: 2 }}
                onPress={() => {
                    mutateInvites("rejected");
                }}
            >
                {({ hovered }) => (
                    <X
                        height={16}
                        width={16}
                        color={semantic.negative}
                        style={{
                            backgroundColor: hovered
                                ? semantic.surfaceVariant
                                : semantic.surface,
                            padding: 4,
                            borderRadius: atoms.radii.sm,
                        }}
                    />
                )}
            </Pressable>
        </View>
    );
};
