import { Text } from "@/components/primitives/Text";
import { Avatar } from "@/components/Profile/Avatar";
import { Name } from "@/components/Profile/Name";
import { useFacet } from "@/lib/facet";
import type { ShardMessage } from "@/lib/types/messages";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { format } from "date-fns";
import { View } from "react-native";

export const Message = ({ message }: { message: ShardMessage }) => {
    const { typography } = useFacet();
    const { semantic } = useCurrentPalette()

    const sentAtString = format(new Date(message.sentAt), "h:mm aaa");

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start",
            }}
        >
            <Avatar did={message.sentBy} />
            <View
                style={{
                    paddingLeft: 12,
                    borderRadius: 8,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                    }}
                >
                    <Name did={message.sentBy} />
                    <Text
                        style={{
                            fontSize: 12,
                            color: semantic.textTertiary,
                        }}
                    >
                        {sentAtString}
                    </Text>
                </View>
                <View>
                    <Text
                        style={[
                            {
                                marginBottom: 4,
                            },
                            // @ts-expect-error it's fiiiiiiine
                            {
                                fontWeight: typography.weights.extralight,
                            },
                            typography.sizes.sm,
                        ]}
                    >
                        {message.content}
                    </Text>
                </View>
            </View>
        </View>
    );
};
