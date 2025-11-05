import { ChannelPickerSpace } from "@/components/Navigation/ChannelsPicker/ChannelPickerSpace";
import { useFacet } from "@/lib/facet";
import type { AtUri } from "@/lib/types/atproto";
import type { SystemsGmstnDevelopmentChannel } from "@/lib/types/lexicon/systems.gmstn.development.channels";
import { useChannelRecords } from "@/providers/authed/ChannelsProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { useMemo } from "react";
import { View } from "react-native";

export const ChannelsPicker = () => {
    const { channels } = useChannelRecords();
    const { semantic } = useCurrentPalette();
    const { atoms } = useFacet();

    // we consider a did to be a space.
    const channelsBySpace = useMemo(
        () =>
            channels.reduce(
                (map, channel) => {
                    const { authority } = channel.channelAtUri;
                    const group = map.get(authority) ?? [];
                    group.push(channel);
                    map.set(authority, group);
                    return map;
                },
                new Map<
                    string,
                    Array<{
                        channel: SystemsGmstnDevelopmentChannel;
                        channelAtUri: AtUri;
                    }>
                >(),
            ),
        [channels],
    );

    const spaces = channelsBySpace.entries().toArray();

    return (
        <View
            style={{
                backgroundColor: semantic.backgroundDarker,
                padding: 12,
                paddingTop: 6,
                borderTopRightRadius: atoms.radii.xl,
            }}
        >
            {spaces.map((space) => (
                <ChannelPickerSpace key={space[0]} space={space} />
            ))}
        </View>
    );
};
