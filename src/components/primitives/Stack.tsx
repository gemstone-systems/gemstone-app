import { useDebugState } from "@/providers/DebugProvider";
import { Stack as ExpoStack } from "expo-router";

export const Stack = () => {
    const debugValue = useDebugState();
    const { showStackHeader } = debugValue;
    return <ExpoStack screenOptions={{ headerShown: showStackHeader }} />;
};
