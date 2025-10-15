import { Login } from "@/components/Auth/Login";
import ChatComponentProfiled from "@/components/ChatComponentProfiled";
import { useOAuthSession } from "@/providers/OAuthProvider";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Index() {
    const router = useRouter();
    const session = useOAuthSession();
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {session ? <ChatComponentProfiled did={session.did} /> : <Login />}
        </View>
    );
}
