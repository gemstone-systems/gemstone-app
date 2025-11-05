import { Chat } from "@/components/Chat";
import { Text } from "@/components/primitives/Text";
import type { AtUri, DidPlc, DidWeb } from "@/lib/types/atproto";
import { useChannelRecordByAtUriObject } from "@/providers/authed/ChannelsProvider";
import { usePathname } from "expo-router";
import { View } from "react-native";

const ChannelRoute = () => {
    const path = usePathname();
    const segments = path.split("/");
    const authority = segments[1] as DidPlc | DidWeb;
    const collection = "systems.gmstn.development.channel";
    const rKey = segments[3];

    const atUri: Required<AtUri> = {
        authority,
        collection,
        rKey,
    };

    const channelRecord = useChannelRecordByAtUriObject(atUri);

    return channelRecord ? (
        <View>
            <Chat channelAtUri={channelRecord.channelAtUri} />
        </View>
    ) : (
        <View>
            <Text>channel record not found :(</Text>
        </View>
    );
};

export default ChannelRoute;
