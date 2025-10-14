import { useWebSocket } from "@/hooks/useWebSocket";
import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";

export default function ChatComponent() {
    const [inputText, setInputText] = useState("");
    const { messages, isConnected, sendMessage } = useWebSocket(
        "ws://localhost:8080",
    );

    const handleSend = () => {
        if (inputText.trim()) {
            sendMessage(inputText);
            setInputText("");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.status}>
                    {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
                </Text>
            </View>

            <ScrollView style={styles.messagesContainer}>
                {messages.map((msg, index) => (
                    <View key={index} style={styles.messageItem}>
                        <Text style={styles.messageText}>{msg.text}</Text>
                        <Text style={styles.timestamp}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </Text>
                    </View>
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
