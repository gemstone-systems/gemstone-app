import { Message } from "@/components/Chat/Message";
import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import { useFacet } from "@/lib/facet";
import { useChannel } from "@/lib/hooks/useChannel";
import type { AtUri } from "@/lib/types/atproto";
import { useProfile } from "@/providers/authed/ProfileProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { ArrowUp } from "lucide-react-native";
import { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
} from "react-native";

export const Chat = ({ channelAtUri }: { channelAtUri: AtUri }) => {
    const [inputText, setInputText] = useState("");
    const { messages, sendMessageToChannel, isConnected } =
        useChannel(channelAtUri);
    const { semantic } = useCurrentPalette();
    const { typography, atoms } = useFacet();

    const handleSend = () => {
        if (inputText.trim()) {
            sendMessageToChannel(inputText);
            setInputText("");
        }
    };

    const { profile, isLoading } = useProfile();

    return isLoading ? (
        <Loading />
    ) : (
        <View
            style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "stretch",
            }}
        >
            {profile && (
                <View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: semantic.borderVariant,
                            alignItems: "center",
                        }}
                    >
                        <Text>
                            Hi, {profile.displayName ?? profile.handle}!
                        </Text>
                        {profile.avatar && (
                            <Image
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: atoms.radii.full,
                                }}
                                source={{ uri: profile.avatar }}
                            />
                        )}
                    </View>
                </View>
            )}
            <View
                style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: semantic.borderVariant,
                }}
            >
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: "600",
                    }}
                >
                    {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
                </Text>
            </View>

            <FlatList
                inverted
                data={messages.toReversed()}
                renderItem={({ item }) => <Message message={item} />}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{
                    paddingLeft: 20,
                    flex: 1,
                    gap: 2,
                }}
                showsVerticalScrollIndicator={false}
            />

            <View
                style={{
                    flexDirection: "row",
                    padding: 16,
                    alignItems: "center",
                }}
            >
                <TextInput
                    style={[
                        {
                            flex: 1,
                            borderWidth: 1,
                            borderColor: semantic.border,
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            marginRight: 8,
                            color: semantic.text,
                            outline: "0",
                        },
                        typography.sizes.base,
                    ]}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="boop"
                    placeholderTextColor={semantic.textTertiary}
                    onSubmitEditing={handleSend}
                    // eslint-disable-next-line @typescript-eslint/no-deprecated -- can't get it working with the new prop.
                    blurOnSubmit={false}
                />
                <TouchableOpacity
                    style={{
                        backgroundColor: inputText.trim()
                            ? semantic.primary
                            : semantic.border,
                        borderRadius: atoms.radii.full,
                        justifyContent: "center",
                        height: 36,
                        width: 36,
                        alignItems: "center",
                    }}
                    onPress={handleSend}
                    disabled={!isConnected}
                >
                    <ArrowUp height={20} width={20} />
                </TouchableOpacity>
            </View>
        </View>
    );
};
