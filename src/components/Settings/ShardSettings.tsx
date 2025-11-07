import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import { RegisterShardModalContent } from "@/components/Settings/RegisterShardModalContent";
import { ShardInfo } from "@/components/Settings/ShardInfo";
import { useFacet } from "@/lib/facet";
import { fade, lighten } from "@/lib/facet/src/lib/colors";
import type { AtUri } from "@/lib/types/atproto";
import { stringToAtUri } from "@/lib/utils/atproto";
import { useOAuthSessionGuaranteed } from "@/providers/OAuthProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { getUserShards } from "@/queries/get-shards-from-pds";
import type { OAuthSession } from "@atproto/oauth-client";
import { useQuery } from "@tanstack/react-query";
import { Gem, HardDrive, Plus } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, View } from "react-native";

export const ShardSettings = () => {
    const { semantic } = useCurrentPalette();
    const { atoms, typography } = useFacet();
    const session = useOAuthSessionGuaranteed();
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const { data: shards, isLoading } = useQuery({
        queryKey: ["shard", session.did],
        queryFn: async () => {
            return await shardsQueryFn(session);
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
                <HardDrive height={20} width={20} color={semantic.text} />
                <Text
                    style={[
                        typography.weights.byName.medium,
                        typography.sizes.xl,
                    ]}
                >
                    Shards
                </Text>
            </View>
            {shards && shards.length > 0 && (
                <View style={{ marginLeft: 10, gap: 8 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        <Gem height={16} width={16} color={semantic.text} />
                        <Text style={[typography.weights.byName.normal]}>
                            Your Shards
                        </Text>
                    </View>
                    <View
                        style={{
                            gap: 4,
                            marginLeft: 8,
                        }}
                    >
                        {shards.map((shard, idx) => (
                            <ShardInfo key={idx} shard={shard} />
                        ))}
                    </View>
                </View>
            )}
            <View>
                <Pressable
                    style={{ alignSelf: "flex-start", marginLeft: 10 }}
                    onPress={() => {
                        setShowRegisterModal(true);
                    }}
                >
                    {({ hovered }) => (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",

                                gap: 4,
                                backgroundColor: hovered
                                    ? lighten(semantic.primary, 7)
                                    : semantic.primary,
                                alignSelf: "flex-start",
                                padding: 8,
                                paddingRight: 12,
                                borderRadius: atoms.radii.md,
                            }}
                        >
                            <Plus
                                height={16}
                                width={16}
                                color={semantic.textInverse}
                            />
                            <Text
                                style={[
                                    typography.weights.byName.normal,
                                    { color: semantic.textInverse },
                                ]}
                            >
                                Register a Shard
                            </Text>
                        </View>
                    )}
                </Pressable>
                <Modal
                    visible={showRegisterModal}
                    onRequestClose={() => {
                        setShowRegisterModal(!showRegisterModal);
                    }}
                    animationType="fade"
                    transparent={true}
                >
                    <Pressable
                        style={{
                            flex: 1,
                            cursor: "auto",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: fade(
                                semantic.backgroundDarker,
                                60,
                            ),
                        }}
                        onPress={() => {
                            setShowRegisterModal(false);
                        }}
                    >
                        <Pressable
                            style={{
                                flex: 0,
                                cursor: "auto",
                                alignItems: "center",
                            }}
                            onPress={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <RegisterShardModalContent
                                setShowRegisterModal={setShowRegisterModal}
                            />
                        </Pressable>
                    </Pressable>
                </Modal>
            </View>
        </View>
    );
};

const shardsQueryFn = async (session: OAuthSession) => {
    const shards = await getUserShards({
        pdsEndpoint: session.serverMetadata.issuer,
        did: session.did,
    });

    if (!shards.ok) {
        console.error("shardQueryFn error.", shards.error);
        throw new Error(
            `Something went wrong while getting the user's shard records.}`,
        );
    }

    const results = shards.data
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
        .filter((atUri) => atUri !== undefined);

    return results;
};
