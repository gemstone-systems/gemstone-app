import { SessionGate } from "@/components/Auth/SessionGate";
import { TopBar } from "@/components/Navigation/TopBar";
import { Stack } from "@/components/primitives/Stack";
import { AuthedProviders } from "@/providers/authed";
import { useCurrentPalette } from "@/providers/ThemeProvider";

export default function ProtectedLayout() {
    const { semantic } = useCurrentPalette();
    return (
        <SessionGate>
            <AuthedProviders>
                <TopBar />
                <Stack
                    screenOptions={{
                        contentStyle: {
                            backgroundColor: semantic.background,
                        },
                    }}
                />
            </AuthedProviders>
        </SessionGate>
    );
}
