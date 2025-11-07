import { Message } from "@/components/Chat/Message";
import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import { useFacet } from "@/lib/facet";
import { useChannel } from "@/lib/hooks/useChannel";
import type { AtUri } from "@/lib/types/atproto";
import { useChannelRecordByAtUriObject } from "@/providers/authed/ChannelsProvider";
import { useProfile } from "@/providers/authed/ProfileProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { ArrowUp, Dot, Hash } from "lucide-react-native";
import { useState } from "react";
import { View, TextInput, FlatList, Pressable } from "react-native";

export const Chat = ({ channelAtUri }: { channelAtUri: AtUri }) => {
    const [inputText, setInputText] = useState("");
    const { messages, sendMessageToChannel, isConnected } =
        useChannel(channelAtUri);
    const record = useChannelRecordByAtUriObject(channelAtUri);
    const { semantic } = useCurrentPalette();
    const { typography, atoms } = useFacet();

    const handleSend = () => {
        if (inputText.trim()) {
            sendMessageToChannel(inputText);
            setInputText("");
        }
    };

    const { isLoading } = useProfile();

    if (!record)
        return (
            <View>
                <Text>
                    Something has gone wrong. Could not resolve channel record
                    from given at:// URI.
                </Text>
            </View>
        );

    return isLoading ? (
        <Loading />
    ) : (
        <View
            style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "stretch",
                backgroundColor: semantic.backgroundDark,
            }}
        >
            <View
                style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    flexDirection: "row",
                    boxShadow: atoms.boxShadows.lg,
                    justifyContent: "space-between",
                    backgroundColor: semantic.background,
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        gap: 2,
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 4,
                            alignItems: "center",
                        }}
                    >
                        <Hash
                            style={{
                                height: 16,
                                width: 16,
                            }}
                            color={semantic.border}
                        />
                        <Text
                            style={[
                                {
                                    color: semantic.textSecondary,
                                },
                                typography.sizes.sm,
                            ]}
                        >
                            {record.channel.name}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 2,
                            alignItems: "center",
                        }}
                    >
                        <Dot
                            style={{
                                height: 24,
                                width: 24,
                            }}
                            color={semantic.border}
                        />
                        <Text
                            style={[
                                {
                                    color: semantic.textTertiary,
                                },
                                typography.sizes.sm,
                            ]}
                        >
                            {record.channel.topic}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: atoms.radii.full,
                        backgroundColor: isConnected
                            ? semantic.positive
                            : semantic.negative,
                    }}
                />
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
                    editable={isConnected}
                    style={[
                        {
                            flex: 1,
                            borderWidth: 1,
                            borderColor: semantic.borderVariant,
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 12,
                            marginRight: 8,
                            color: semantic.text,
                            outline: "0",
                            cursor: isConnected ? "" : "not-allowed",
                            fontFamily: typography.families.primary,
                        },
                        typography.weights.byName.extralight,
                        typography.sizes.sm,
                    ]}
                    cursorColor={
                        isConnected ? semantic.textTertiary : "transparent"
                    }
                    selectionColor={semantic.primary}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder={`Message #${record.channel.name}`}
                    placeholderTextColor={semantic.textPlaceholder}
                    onSubmitEditing={handleSend}
                    // eslint-disable-next-line @typescript-eslint/no-deprecated -- can't get it working with the new prop.
                    blurOnSubmit={false}
                />
                <Pressable
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
                </Pressable>
            </View>
        </View>
    );
};
