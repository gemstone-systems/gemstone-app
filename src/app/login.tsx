import { Login } from "@/components/Auth/Login";
import { Loading } from "@/components/primitives/Loading";
import { useOAuthValue } from "@/providers/OAuthProvider";
import { Redirect } from "expo-router";
import { View } from "react-native";

const LoginPage = () => {
    const { isLoading, session } = useOAuthValue();

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Loading />
            </View>
        );
    }

    if (session) {
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
