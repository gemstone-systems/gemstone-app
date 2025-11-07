import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import { ChannelInfo } from "@/components/Settings/ChannelInfo";
import { useFacet } from "@/lib/facet";
import type { AtUri } from "@/lib/types/atproto";
import { stringToAtUri } from "@/lib/utils/atproto";
import { useOAuthSessionGuaranteed } from "@/providers/OAuthProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { getChannelRecordsFromPds } from "@/queries/get-channels-from-pds";
import type { OAuthSession } from "@atproto/oauth-client";
import { useQuery } from "@tanstack/react-query";
import { MessagesSquare } from "lucide-react-native";
import { View } from "react-native";

export const ChannelSettings = () => {
    const { atoms, typography } = useFacet();
    const { semantic } = useCurrentPalette();
    const session = useOAuthSessionGuaranteed();

    const { isLoading, data: channels } = useQuery({
        queryKey: ["channels", session.did],
        queryFn: async () => {
            return await channelsQueryFn(session);
        },
    });

    return isLoading ? (
        <Loading />
    ) : (
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
                <MessagesSquare height={20} width={20} color={semantic.text} />
                <Text
                    style={[
                        typography.weights.byName.medium,
                        typography.sizes.xl,
                    ]}
                >
                    Channels
                </Text>
            </View>
            {channels && channels.length > 0 && (
                <View
                    style={{
                        gap: 4,
                        marginLeft: 8,
                    }}
                >
                    {channels.map((channel, idx) => (
                        <ChannelInfo key={idx} channel={channel} />
                    ))}
                </View>
            )}
        </View>
    );
};

const channelsQueryFn = async (session: OAuthSession) => {
    const channels = await getChannelRecordsFromPds({
        pdsEndpoint: session.serverMetadata.issuer,
        did: session.did,
    });

    if (!channels.ok) {
        console.error("channelsQueryFn error.", channels.error);
        throw new Error(
            `Something went wrong while getting the user's channel records.}`,
        );
    }

    const results = channels.data
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
            return { cid: record.cid, uri, value: record.value };
        })
        .filter((atUri) => atUri !== undefined);

    return results;
};
