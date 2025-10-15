import { SessionGate } from "@/components/Auth/SessionGate";
import { Stack } from "expo-router";

export default function ProtectedLayout() {
    return (
        <SessionGate>
            <Stack />
        </SessionGate>
    );
}
