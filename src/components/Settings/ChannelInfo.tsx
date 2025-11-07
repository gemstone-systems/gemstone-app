import { Text } from "@/components/primitives/Text";
import type { AtUri } from "@/lib/types/atproto";
import type { SystemsGmstnDevelopmentChannel } from "@/lib/types/lexicon/systems.gmstn.development.channel";
import { View } from "react-native";

export const ChannelInfo = ({
    channel,
}: {
    channel: {
        value: SystemsGmstnDevelopmentChannel;
        uri: Required<AtUri>;
    };
}) => {
    return (
        <View>
            <Text>{channel.value.name}</Text>
        </View>
    );
};
