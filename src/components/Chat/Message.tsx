import { Text } from "@/components/primitives/Text";
import { Avatar } from "@/components/Profile/Avatar";
import type { ShardMessage } from "@/lib/types/messages";
import { View } from "react-native";

export const Message = ({ message }: { message: ShardMessage }) => {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-end",
            }}
        >
            <Avatar did={message.sentBy} />
            <View
                style={{
                    marginBottom: 12,
                    padding: 12,
                    borderRadius: 8,
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        marginBottom: 4,
                    }}
                >
                    {message.content}
                </Text>
                <Text
                    style={{
                        fontSize: 12,
                        color: "#666",
                    }}
                >
                    {new Date(message.sentAt).toLocaleTimeString()}
                </Text>
            </View>
        </View>
    );
};
