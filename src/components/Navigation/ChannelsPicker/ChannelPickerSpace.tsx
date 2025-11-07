import { ChannelPickerItem } from "@/components/Navigation/ChannelsPicker/ChannelPickerItem";
import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import type { AtUri, Did } from "@/lib/types/atproto";
import type { SystemsGmstnDevelopmentChannel } from "@/lib/types/lexicon/systems.gmstn.development.channel";
import { getBskyProfile } from "@/queries/get-profile";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { View } from "react-native";

export const ChannelPickerSpace = ({
    space,
}: {
    space: [
        string,
        Array<{
            channel: SystemsGmstnDevelopmentChannel;
            channelAtUri: AtUri;
        }>,
    ];
}) => {
    const spaceDid = space[0];

    const { isLoading, data, error } = useQuery({
        queryKey: ["profile", spaceDid],
        queryFn: async () => {
            return await getBskyProfile(spaceDid as Did);
        },
        staleTime: Infinity,
    });

    const channels = space[1];
    return (
        <>
            {isLoading ? (
                <Loading />
            ) : error ? (
                <Text>{error.message}</Text>
            ) : (
                <View style={{ paddingRight: 16 }}>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 6,
                            alignItems: "center",
                            padding: 4,
                        }}
                    >
                        <Image
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 2000000000,
                            }}
                            source={{ uri: data?.avatar ?? spaceDid }}
                        />
                        <Text>@{data?.handle ?? spaceDid}</Text>
                    </View>
                    <View
                        style={{
                            paddingLeft: 8,
                            display: "flex",
                            gap: 2,
                            paddingTop: 4,
                            paddingBottom: 4,
                        }}
                    >
                        {channels.map(({ channel, channelAtUri }, idx) => (
                            <ChannelPickerItem
                                channel={channel}
                                channelAtUri={channelAtUri}
                                key={idx}
                            />
                        ))}
                    </View>
                </View>
            )}
        </>
    );
};
