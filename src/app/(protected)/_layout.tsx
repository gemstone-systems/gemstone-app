import { SessionGate } from "@/components/Auth/SessionGate";
import { AuthedProviders } from "@/providers/authed";
import { Stack } from "expo-router";

export default function ProtectedLayout() {
    return (
        <SessionGate>
            <AuthedProviders>
                <Stack />
            </AuthedProviders>
        </SessionGate>
    );
}
