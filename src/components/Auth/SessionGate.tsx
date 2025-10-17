import { Loading } from "@/components/Loading";
import { useOAuthValue } from "@/providers/OAuthProvider";
import { Redirect } from "expo-router";
import type { ReactNode } from "react";
import { View } from "react-native";

export const SessionGate = ({ children }: { children: ReactNode }) => {
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

    if (!session) {
        return <Redirect href="/login" />;
    }

    return <>{children}</>;
};
