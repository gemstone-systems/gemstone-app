import { Avatar } from "@/components/Avatar";
import type { ShardMessage } from "@/lib/types/messages";
import { Text, View, StyleSheet } from "react-native";

export const Message = ({ message }: { message: ShardMessage }) => {
    return (
        <View style={styles.messageItemContainer}>
            <Avatar did={message.did} />
            <View style={styles.messageItem}>
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.timestamp}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    messageItemContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-end",
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
});
