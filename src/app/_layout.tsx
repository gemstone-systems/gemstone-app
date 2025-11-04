import { Stack } from "@/components/primitives/Stack";
import { isDevMode } from "@/lib/utils/env";
import { RootProviders } from "@/providers";
import { Lexend_300Light, useFonts } from "@expo-google-fonts/lexend";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Lexend_300Light,
    });

    useEffect(() => {
        if (!isDevMode) return;
        if (Platform.OS === "web" && typeof window !== "undefined") {
            const hostname = window.location.hostname;
            if (hostname === "127.0.0.1") return;
            if (hostname === "localhost") {
                const newUrl = window.location.href.replace(
                    "localhost",
                    "127.0.0.1",
                );
                window.location.replace(newUrl);
                return;
            }

            throw new Error(
                "don't use localhost, use 127.0.0.1. this shouldn't error unless you've done something very wrong.",
            );
        }
    });

    useEffect(() => {
        if (loaded || error) {
            void SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <RootProviders>
            <Stack />
        </RootProviders>
    );
}
