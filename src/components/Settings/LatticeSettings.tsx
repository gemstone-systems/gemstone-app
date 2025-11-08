import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import { LatticeInfo } from "@/components/Settings/LatticeInfo";
import { RegisterLatticeModalContent } from "@/components/Settings/RegisterLatticeModalContent";
import { useFacet } from "@/lib/facet";
import { fade, lighten } from "@/lib/facet/src/lib/colors";
import { useOAuthSessionGuaranteed } from "@/providers/OAuthProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { useLatticesQuery } from "@/queries/hooks/useLatticesQuery";
import { Gem, Plus, Waypoints } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, View } from "react-native";

export const LatticeSettings = () => {
    const { semantic } = useCurrentPalette();
    const { atoms, typography } = useFacet();
    const session = useOAuthSessionGuaranteed();
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const { useQuery } = useLatticesQuery(session)

    const { data: lattices, isLoading } = useQuery()

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
                        {lattices.map((lattice, idx) => (
                            <LatticeInfo key={idx} lattice={lattice} />
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
                                Register
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
                                alignSelf: "center",
                                cursor: "auto",
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
