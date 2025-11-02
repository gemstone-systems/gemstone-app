import { useDebugState } from "@/providers/DebugProvider";
import { Link } from "expo-router";
import { Button, Text, View } from "react-native";

export const DebugRoute = () => {
    const debug = useDebugState();
    const { showStackHeader, setShowStackHeader } = debug;
    return (
        <View>
            <Link href="/login">Back to login</Link>
            <Link href="/">Back home</Link>
            <Button
                title="Show headers?"
                onPress={() => {
                    setShowStackHeader(!showStackHeader);
                }}
            />
            <Text>Current value: {showStackHeader.toString()}</Text>
        </View>
    );
};

export default DebugRoute;
