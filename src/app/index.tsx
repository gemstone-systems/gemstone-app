import { Login } from "@/components/Auth/Login";
import { useOAuthValue } from "@/providers/OAuthProvider";
import { Text, View } from "react-native";

export default function Index() {
    const oAuth = useOAuthValue();
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>
                {oAuth.session
                    ? oAuth.session.serverMetadata.issuer
                    : "no oauth session :("}
            </Text>
            <Login />
        </View>
    );
}
