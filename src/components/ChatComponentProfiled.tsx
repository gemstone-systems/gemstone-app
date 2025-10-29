import { Loading } from "@/components/Loading";
import { Message } from "@/components/Message";
import { useChannel } from "@/lib/hooks/useChannel";
import type { AtUri, DidPlc, DidWeb } from "@/lib/types/atproto";
import { getBskyProfile } from "@/queries/get-profile";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
} from "react-native";

export default function ChatComponentProfiled({
    did,
    channelAtUri,
}: {
    did: DidPlc | DidWeb;
    channelAtUri: AtUri
}) {
    const [inputText, setInputText] = useState("");
    const { messages, sendMessageToChannel, isConnected } = useChannel(
        channelAtUri,
    );

    const handleSend = () => {
        if (inputText.trim()) {
            sendMessageToChannel(inputText);
            setInputText("");
        }
    };

    const {
        data: profile,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: [did],
        queryFn: async () => {
            return await getBskyProfile(did);
        },
    });

    return isPending ? (
        <Loading />
    ) : isError ? (
        <View>
            <Text>Something went wrong :(</Text>
            <Text>{error.message}</Text>
        </View>
    ) : (
        <View style={styles.container}>
            {profile && (
                <View>
                    <View style={styles.profile}>
                        <Text>
                            Hi, {profile.displayName ?? profile.handle}!
                        </Text>
                        {profile.avatar && (
                            <Image
                                style={styles.avatar}
                                source={{ uri: profile.avatar }}
                            />
                        )}
                    </View>
                </View>
            )}
            <View style={styles.header}>
                <Text style={styles.status}>
                    {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
                </Text>
            </View>

            <ScrollView style={styles.messagesContainer}>
                {messages.map((msg, index) => (
                    <Message message={msg} key={index} />
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSend}
                    disabled={!isConnected}
                >
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    profile: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        alignItems: "center",
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 2000000000,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    status: {
        fontSize: 14,
        fontWeight: "600",
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    messageItem: {
        marginBottom: 12,
        padding: 12,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
    },
    messageText: {
        fontSize: 16,
        marginBottom: 4,
    },
    timestamp: {
        fontSize: 12,
        color: "#666",
    },
    inputContainer: {
        flexDirection: "row",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        justifyContent: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
