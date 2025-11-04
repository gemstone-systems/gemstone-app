import { Chat } from "@/components/Chat";
import { Loading } from "@/components/primitives/Loading";
import { useChannelRecords } from "@/providers/authed/ChannelsProvider";
import { useSessions } from "@/providers/authed/SessionsProvider";
import { View } from "react-native";

export default function Index() {
    const { channels } = useChannelRecords();
    const { isInitialising } = useSessions();

    const isAppReady = !isInitialising;
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "stretch",
            }}
        >
            {isAppReady ? (
                <Chat channelAtUri={channels[0].channelAtUri} />
            ) : (
                <Loading />
            )}
        </View>
    );
}
