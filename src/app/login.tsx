import { Login } from "@/components/Auth/Login";
import { useOAuthValue } from "@/providers/OAuthProvider";
import { Redirect } from "expo-router";
import { View } from "react-native";

const LoginPage = () => {
    const { isLoading, session } = useOAuthValue();

    if (!isLoading && session) {
        return <Redirect href="/" />;
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Login />
        </View>
    );
};

export default LoginPage;
