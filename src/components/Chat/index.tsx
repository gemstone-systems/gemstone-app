import { Message } from "@/components/Chat/Message";
import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import { useChannel } from "@/lib/hooks/useChannel";
import type { AtUri } from "@/lib/types/atproto";
import { useProfile } from "@/providers/authed/ProfileProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";

export const Chat = ({ channelAtUri }: { channelAtUri: AtUri }) => {
    const [inputText, setInputText] = useState("");
    const { messages, sendMessageToChannel, isConnected } =
        useChannel(channelAtUri);
    const { semantic } = useCurrentPalette();

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
                            borderBottomColor: semantic.border,
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
                                    borderRadius: 2000000000,
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
                    borderBottomColor: semantic.border,
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

            <ScrollView
                style={{
                    flex: 1,
                    padding: 16,
                }}
            >
                {messages.map((msg, index) => (
                    <Message message={msg} key={index} />
                ))}
            </ScrollView>

            <View
                style={{
                    flexDirection: "row",
                    padding: 16,
                    borderTopWidth: 1,
                    borderTopColor: semantic.border,
                }}
            >
                <TextInput
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: semantic.border,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        marginRight: 8,
                        fontSize: 16,
                        color: semantic.text,
                    }}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="boop"
                    placeholderTextColor={semantic.textTertiary}
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity
                    style={{
                        backgroundColor: semantic.primary,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 8,
                        justifyContent: "center",
                    }}
                    onPress={handleSend}
                    disabled={!isConnected}
                >
                    <Text
                        style={{
                            color: semantic.textInverse,
                            fontSize: 16,
                            fontWeight: "600",
                        }}
                    >
                        Send
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
