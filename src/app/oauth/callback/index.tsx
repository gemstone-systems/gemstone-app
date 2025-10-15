import { useOAuthSession } from "@/providers/OAuthProvider";
import { Text, View } from "react-native";

const AuthCallback = () => {
    const session = useOAuthSession();
    return (
        <View>
            <Text>Auth callback waowgh</Text>
            {session && <Text>{session.did}</Text>}
        </View>
    );
};

export default AuthCallback;
