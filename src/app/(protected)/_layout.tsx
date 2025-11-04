import { SessionGate } from "@/components/Auth/SessionGate";
import { ChannelsPicker } from "@/components/Navigation/ChannelsPicker";
import { TopBar } from "@/components/Navigation/TopBar";
import { Stack } from "@/components/primitives/Stack";
import { AuthedProviders } from "@/providers/authed";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { View } from "react-native";

export default function ProtectedLayout() {
    const { semantic } = useCurrentPalette();

    return (
        <SessionGate>
            <AuthedProviders>
                <View
                    style={{
                        flexDirection: "column",
                        flex: 1,
                        backgroundColor: semantic.background,
                    }}
                >
                    <TopBar />
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        <ChannelsPicker />
                        <Stack
                            screenOptions={{
                                contentStyle: {
                                    backgroundColor: semantic.background,
                                },
                            }}
                        />
                    </View>
                </View>
            </AuthedProviders>
        </SessionGate>
    );
}
