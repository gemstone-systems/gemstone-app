import { useDebugState } from "@/providers/DebugProvider";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Stack as ExpoStack } from "expo-router";

export const Stack = ({
    screenOptions,
    ...props
}: {
    screenOptions?: NativeStackNavigationOptions;
}) => {
    const debugValue = useDebugState();
    const { showStackHeader } = debugValue;
    return (
        <ExpoStack
            screenOptions={{ headerShown: showStackHeader, ...screenOptions }}
        />
    );
};
