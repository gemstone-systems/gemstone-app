import ChatComponentProfiled from "@/components/ChatComponentProfiled";
import { useOAuthSession } from "@/providers/OAuthProvider";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function Index() {
    const oAuthSession = useOAuthSession();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {oAuthSession ? (
                <ChatComponentProfiled did={oAuthSession.did} />
            ) : (
                <Redirect href={"/login"} />
            )}
        </View>
    );
}
