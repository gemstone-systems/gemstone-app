import { SessionGate } from "@/components/Auth/SessionGate";
import { TopBar } from "@/components/Navigation/TopBar";
import { Stack } from "@/components/primitives/Stack";
import { AuthedProviders } from "@/providers/authed";

export default function ProtectedLayout() {
    return (
        <SessionGate>
            <AuthedProviders>
                <TopBar />
                <Stack />
            </AuthedProviders>
        </SessionGate>
    );
}
