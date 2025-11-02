import { SessionGate } from "@/components/Auth/SessionGate";
import { Stack } from "@/components/primitives/Stack";
import { AuthedProviders } from "@/providers/authed";

export default function ProtectedLayout() {
    return (
        <SessionGate>
            <AuthedProviders>
                <Stack />
            </AuthedProviders>
        </SessionGate>
    );
}
