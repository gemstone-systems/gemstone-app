import { Text } from "@/components/primitives/Text";
import { InviteUserModalContent } from "@/components/Settings/InviteUserModalContent";
import { useFacet } from "@/lib/facet";
import { fade } from "@/lib/facet/src/lib/colors";
import type { AtUri } from "@/lib/types/atproto";
import type { SystemsGmstnDevelopmentChannel } from "@/lib/types/lexicon/systems.gmstn.development.channel";
import { atUriToString } from "@/lib/utils/atproto";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { Hash, UserRoundPlus } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, View } from "react-native";

export const ChannelInfo = ({
    channel,
}: {
    channel: {
        value: SystemsGmstnDevelopmentChannel;
        uri: Required<AtUri>;
        cid: string;
    };
}) => {
    const { semantic } = useCurrentPalette();
    const { atoms } = useFacet();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const channelAtUri = atUriToString(channel.uri);

    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Hash height={16} width={16} color={semantic.text} />
            <Text>{channel.value.name}</Text>
            <Pressable
                style={{ marginLeft: 2 }}
                onPress={() => {
                    setShowInviteModal(true);
                }}
            >
                {({ hovered }) => (
                    <UserRoundPlus
                        height={16}
                        width={16}
                        color={hovered ? semantic.primary : semantic.text}
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
            <Modal
                visible={showInviteModal}
                onRequestClose={() => {
                    setShowInviteModal(!showInviteModal);
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
                        backgroundColor: fade(semantic.backgroundDarker, 60),
                    }}
                    onPress={() => {
                        setShowInviteModal(false);
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
                        <InviteUserModalContent
                            setShowInviteModal={setShowInviteModal}
                            channelAtUri={channelAtUri}
                            channelCid={channel.cid}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};
