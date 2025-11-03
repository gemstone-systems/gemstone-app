import ChatComponentProfiled from "@/components/ChatComponentProfiled";
import { Loading } from "@/components/Loading";
import { useChannelRecords } from "@/providers/authed/ChannelsProvider";
import { useSessions } from "@/providers/authed/SessionsProvider";
import { useOAuthSession } from "@/providers/OAuthProvider";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function Index() {
    const oAuthSession = useOAuthSession();
    const { channels } = useChannelRecords();
    const { isInitialising } = useSessions();

    const isAppReady = !isInitialising;
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {oAuthSession ? (
                isAppReady ? (
                    <ChatComponentProfiled
                        did={oAuthSession.did}
                        channelAtUri={channels[0].channelAtUri}
                    />
                ) : (
                    <Loading />
                )
            ) : (
                <Redirect href="/login" />
            )}
        </View>
    );
}
