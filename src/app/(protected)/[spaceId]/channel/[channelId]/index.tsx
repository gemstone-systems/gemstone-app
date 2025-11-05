import { Chat } from "@/components/Chat";
import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import type { AtUri, DidPlc, DidWeb } from "@/lib/types/atproto";
import { useChannelRecordByAtUriObject } from "@/providers/authed/ChannelsProvider";
import { useSessions } from "@/providers/authed/SessionsProvider";
import { usePathname } from "expo-router";
import { View } from "react-native";

const ChannelRoute = () => {
    const path = usePathname();
    const segments = path.split("/");
    const authority = segments[1] as DidPlc | DidWeb;
    const collection = "systems.gmstn.development.channel";
    const rKey = segments[3];
    const { isInitialising } = useSessions();

    const isAppReady = !isInitialising;

    const atUri: Required<AtUri> = {
        authority,
        collection,
        rKey,
    };

    const channelRecord = useChannelRecordByAtUriObject(atUri);

    return !isAppReady ? (
        <Loading />
    ) : channelRecord ? (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "stretch",
            }}
        >
            <Chat channelAtUri={channelRecord.channelAtUri} />
        </View>
    ) : (
        <View>
            <Text>channel record not found :(</Text>
        </View>
    );
};

export default ChannelRoute;
