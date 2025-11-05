import { Text } from "@/components/primitives/Text";
import { useFacet } from "@/lib/facet";
import type { AtUri } from "@/lib/types/atproto";
import type { SystemsGmstnDevelopmentChannel } from "@/lib/types/lexicon/systems.gmstn.development.channels";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { Link, usePathname } from "expo-router";
import { Hash } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { Pressable } from "react-native-gesture-handler";

export const ChannelPickerItem = ({
    channel,
    channelAtUri,
}: {
    channel: SystemsGmstnDevelopmentChannel;
    channelAtUri: AtUri;
}) => {
    const { semantic, colors } = useCurrentPalette();
    const { typography, atoms } = useFacet();
    const path = usePathname();
    const [hovered, setHovered] = useState(false);

    const { authority, collection, rKey } = channelAtUri;

    if (!collection || !rKey)
        throw new Error(
            "Channel at:// URI object provided to channel picker item must contain a collection and rkey fields.",
        );

    const pathRKey = path.split("/")[3];

    const isCurrentChannel = pathRKey === rKey;

    const hoverHandler = () => {
        setHovered((hovered) => !hovered);
    };

    return (
        <Pressable onHoverIn={hoverHandler} onHoverOut={hoverHandler}>
            <Link href={`/${authority}/channel/${rKey}`}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingLeft: 4,
                        paddingRight: 8,
                        paddingTop: 2,
                        paddingBottom: 3,
                        gap: 2,
                        backgroundColor:
                            isCurrentChannel || hovered
                                ? semantic.surface
                                : undefined,
                        borderRadius: atoms.radii.lg,
                    }}
                >
                    <Hash
                        style={{
                            height: 16,
                            width: 16,
                        }}
                        color={
                            isCurrentChannel ? colors.subtext0 : colors.overlay2
                        }
                    />
                    <Text
                        style={[
                            {
                                color: isCurrentChannel
                                    ? colors.subtext0
                                    : colors.overlay2,
                            },
                            typography.sizes.sm,
                        ]}
                    >
                        {channel.name}
                    </Text>
                </View>
            </Link>
        </Pressable>
    );
};
