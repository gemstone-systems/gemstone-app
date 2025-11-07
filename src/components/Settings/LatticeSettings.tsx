import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import { LatticeInfo } from "@/components/Settings/LatticeInfo";
import { RegisterLatticeModalContent } from "@/components/Settings/RegisterLatticeModalContent";
import { useFacet } from "@/lib/facet";
import { fade } from "@/lib/facet/src/lib/colors";
import type { AtUri } from "@/lib/types/atproto";
import { stringToAtUri } from "@/lib/utils/atproto";
import { useOAuthSessionGuaranteed } from "@/providers/OAuthProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { getUserLattices } from "@/queries/get-lattices-from-pds";
import type { OAuthSession } from "@atproto/oauth-client";
import { useQuery } from "@tanstack/react-query";
import { Gem, Plus, Waypoints } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, View } from "react-native";

export const LatticeSettings = () => {
    const { semantic } = useCurrentPalette();
    const { atoms, typography } = useFacet();
    const session = useOAuthSessionGuaranteed();
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const { data: lattices, isLoading } = useQuery({
        queryKey: ["lattice", session.did],
        queryFn: async () => {
            return await latticeQueryFn(session);
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
                <Waypoints height={20} width={20} color={semantic.text} />
                <Text
                    style={[
                        typography.weights.byName.medium,
                        typography.sizes.xl,
                    ]}
                >
                    Lattices
                </Text>
            </View>
            {lattices && lattices.length > 0 && (
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
                            Your Lattices
                        </Text>
                    </View>
                    <View
                        style={{
                            gap: 4,
                            marginLeft: 8,
                        }}
                    >
                        {lattices.map((shard, idx) => (
                            <LatticeInfo key={idx} shard={shard} />
                        ))}
                    </View>
                </View>
            )}
            <View>
                <Pressable
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 10,
                        gap: 4,
                        backgroundColor: semantic.primary,
                        alignSelf: "flex-start",
                        padding: 8,
                        paddingRight: 12,
                        borderRadius: atoms.radii.md,
                    }}
                    onPress={() => {
                        setShowRegisterModal(true);
                    }}
                >
                    <Plus height={16} width={16} color={semantic.textInverse} />
                    <Text
                        style={[
                            typography.weights.byName.normal,
                            { color: semantic.textInverse },
                        ]}
                    >
                        Register a Lattice
                    </Text>
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
                            <RegisterLatticeModalContent
                                setShowRegisterModal={setShowRegisterModal}
                            />
                        </Pressable>
                    </Pressable>
                </Modal>
            </View>
        </View>
    );
};

const latticeQueryFn = async (session: OAuthSession) => {
    const shards = await getUserLattices({
        pdsEndpoint: session.serverMetadata.issuer,
        did: session.did,
    });

    if (!shards.ok) {
        console.error("shardQueryFn error.", shards.error);
        throw new Error(
            `Something went wrong while getting the user's membership records.}`,
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
