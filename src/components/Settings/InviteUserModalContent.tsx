import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import { useFacet } from "@/lib/facet";
import { lighten } from "@/lib/facet/src/lib/colors";
import type { AtUri } from "@/lib/types/atproto";
import { didSchema } from "@/lib/types/atproto";
import type { SystemsGmstnDevelopmentChannelInvite } from "@/lib/types/lexicon/systems.gmstn.development.channel.invite";
import { didDocResolver, stringToAtUri } from "@/lib/utils/atproto";
import { inviteNewUser } from "@/lib/utils/gmstn";
import {
    useOAuthAgentGuaranteed,
    useOAuthSessionGuaranteed,
} from "@/providers/OAuthProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { getInviteRecordsFromPds } from "@/queries/get-invites-from-pds";
import { type OAuthSession } from "@atproto/oauth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus } from "lucide-react-native";
import { useState, type Dispatch, type SetStateAction } from "react";
import { FlatList, Pressable, TextInput, View } from "react-native";

export const InviteUserModalContent = ({
    setShowInviteModal,
    channelAtUri,
    channelCid,
}: {
    setShowInviteModal: Dispatch<SetStateAction<boolean>>;
    channelAtUri: string;
    channelCid: string;
}) => {
    const { semantic } = useCurrentPalette();
    const { atoms, typography } = useFacet();
    const [inputText, setInputText] = useState("");
    const session = useOAuthSessionGuaranteed();
    const agent = useOAuthAgentGuaranteed();
    const queryClient = useQueryClient();

    const { isLoading, data: invites } = useQuery({
        queryKey: ["invites", session.did],
        queryFn: async () => {
            return await invitesQueryFn({ session, channelAtUri });
        },
    });

    const { mutate: inviteUserMutation, isPending: mutationPending } =
        useMutation({
            mutationFn: async () => {
                const {
                    success,
                    error,
                    data: did,
                } = didSchema.safeParse(inputText);
                if (!success) throw new Error(error.message);
                const inviteRes = await inviteNewUser({
                    agent,
                    did,
                    channel: {
                        uri: channelAtUri,
                        cid: channelCid,
                        $type: "com.atproto.repo.strongRef",
                    },
                });
                console.log(inviteRes)
                if (!inviteRes.ok) throw new Error(inviteRes.error);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: ["invites", session.did],
                });
            },
        });

    const disableSubmitButton = (() => {
        const { success } = didSchema.safeParse(inputText);
        if (!success) return true;
        return !inputText.trim();
    })();

    return (
        <View
            style={{
                backgroundColor: semantic.surface,
                borderRadius: atoms.radii.lg,
                display: "flex",
                gap: 12,
                padding: 16,
            }}
        >
            <View style={{ gap: 4 }}>
                <Text>User DID:</Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                    }}
                >
                    <TextInput
                        style={[
                            {
                                flex: 1,
                                borderWidth: 1,
                                borderColor: semantic.borderVariant,
                                borderRadius: atoms.radii.md,
                                padding: 10,
                                color: semantic.text,
                                outline: "0",
                                fontFamily: typography.families.primary,
                                minWidth: 256,
                            },
                            typography.weights.byName.extralight,
                            typography.sizes.sm,
                        ]}
                        value={inputText}
                        onChangeText={(text) => {
                            setInputText(text);
                        }}
                        placeholder="did:plc:... or did:web:..."
                        placeholderTextColor={semantic.textPlaceholder}
                    />
                    <Pressable
                        onPress={() => {
                            console.log("mutating");
                            inviteUserMutation();
                        }}
                        disabled={disableSubmitButton}
                    >
                        {({ hovered }) =>
                            mutationPending ? (
                                <Loading size="small" />
                            ) : (
                                <Plus
                                    height={20}
                                    width={20}
                                    style={{
                                        backgroundColor: disableSubmitButton
                                            ? semantic.textPlaceholder
                                            : hovered
                                              ? lighten(semantic.primary, 7)
                                              : semantic.primary,
                                        alignSelf: "flex-start",
                                        padding: 10,
                                        borderRadius: atoms.radii.md,
                                        borderColor: semantic.borderVariant,
                                    }}
                                />
                            )
                        }
                    </Pressable>
                </View>
            </View>
            <View style={{ gap: 4 }}>
                <Text>Invited users:</Text>
                {isLoading ? (
                    <Loading size="small" />
                ) : (
                    invites && (
                        <FlatList
                            inverted
                            data={invites.toReversed()}
                            renderItem={({ item }) => (
                                <InvitedUser invite={item} />
                            )}
                            keyExtractor={(_, index) => index.toString()}
                            contentContainerStyle={{
                                flex: 1,
                                gap: 2,
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    )
                )}
            </View>
        </View>
    );
};

const invitesQueryFn = async ({
    session,
    channelAtUri,
}: {
    session: OAuthSession;
    channelAtUri: string;
}) => {
    const invites = await getInviteRecordsFromPds({
        pdsEndpoint: session.serverMetadata.issuer,
        did: session.did,
    });

    if (!invites.ok) {
        console.error("invitesQueryFn error.", invites.error);
        throw new Error(
            `Something went wrong while getting the user's channel records.}`,
        );
    }

    const results = invites.data
        .map((record) => {
            const convertResult = stringToAtUri(record.uri);
            if (!convertResult.ok) {
                console.error(
                    "Could not convert",
                    record,
                    "into at:// URI object.",
                    convertResult.error,
                );
                return;
            }
            if (!convertResult.data.collection || !convertResult.data.rKey) {
                console.error(
                    record,
                    "did not convert to a full at:// URI with collection and rkey.",
                );
                return;
            }
            const uri: Required<AtUri> = {
                authority: convertResult.data.authority,
                collection: convertResult.data.collection,
                rKey: convertResult.data.rKey,
            };
            return { uri, value: record.value };
        })
        .filter((atUri) => atUri !== undefined)
        .filter((atUri) => atUri.value.channel.uri === channelAtUri);

    return results;
};

const InvitedUser = ({
    invite,
}: {
    invite: {
        value: SystemsGmstnDevelopmentChannelInvite;
        uri: Required<AtUri>;
    };
}) => {
    const { isLoading, data: handle } = useQuery({
        queryKey: ["handle", invite.value.recipient],
        queryFn: async () => {
            const didDoc = await didDocResolver.resolve(invite.value.recipient);
            if (!didDoc.alsoKnownAs)
                throw new Error("DID did not resolve to handle");
            if (didDoc.alsoKnownAs.length === 0)
                throw new Error(
                    "No alsoKnownAs in DID document. It might be malformed.",
                );
            return didDoc.alsoKnownAs[0].slice(5);
        },
    });

    return (
        <View>
            {isLoading ? (
                <Loading size="small" />
            ) : (
                handle && (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 32,
                        }}
                    >
                        <Text>@{handle}</Text>
                        <Text>
                            since{" "}
                            {format(
                                invite.value.createdAt,
                                "do MMM y, h:mmaaa",
                            )}
                        </Text>
                    </View>
                )
            )}
        </View>
    );
};
