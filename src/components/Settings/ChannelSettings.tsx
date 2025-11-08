import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import { AddChannelModalContent } from "@/components/Settings/AddChannelModalContent";
import { ChannelInfo } from "@/components/Settings/ChannelInfo";
import { useFacet } from "@/lib/facet";
import { fade, lighten } from "@/lib/facet/src/lib/colors";
import { useOAuthSessionGuaranteed } from "@/providers/OAuthProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { useChannelsQuery } from "@/queries/hooks/useChannelsQuery";
import { MessagesSquare, Plus } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, View } from "react-native";

export const ChannelSettings = () => {
    const { atoms, typography } = useFacet();
    const { semantic } = useCurrentPalette();
    const session = useOAuthSessionGuaranteed();
    const [showAddModal, setShowAddModal] = useState(false);
    const { useQuery } = useChannelsQuery(session);

    const { isLoading, data: channels } = useQuery();

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
            <View>
                <Pressable
                    style={{ alignSelf: "flex-start", marginLeft: 10 }}
                    onPress={() => {
                        setShowAddModal(true);
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
                                Add
                            </Text>
                        </View>
                    )}
                </Pressable>
                <Modal
                    visible={showAddModal}
                    onRequestClose={() => {
                        setShowAddModal(!showAddModal);
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
                            setShowAddModal(false);
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
                            <AddChannelModalContent
                                setShowAddModal={setShowAddModal}
                            />
                        </Pressable>
                    </Pressable>
                </Modal>
            </View>
        </View>
    );
};
