import ChatComponentProfiled from "@/components/ChatComponentProfiled";
import { useLatticeSession } from "@/providers/authed/LatticeSessionsProvider";
import { useOAuthSession } from "@/providers/OAuthProvider";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
    const oAuthSession = useOAuthSession();
    const sessionsMap = useLatticeSession();
    const sessions = sessionsMap.values().toArray();
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
            {sessions.map((session, idx) => (
                <Text key={idx}>{session.latticeDid}</Text>
            ))}
        </View>
    );
}
