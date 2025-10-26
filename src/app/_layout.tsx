import { isDevMode } from "@/lib/utils/env";
import { RootProviders } from "@/providers";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function RootLayout() {
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

    return (
        <RootProviders>
            <Stack />
        </RootProviders>
    );
}
