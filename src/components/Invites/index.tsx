import { Text } from "@/components/primitives/Text";
import { View } from "react-native";

export const Invites = () => {
    return (
        <View
            style={{
                flex: 1,
                flexDirection: "column",
                padding: 32,
                gap: 16,
                alignItems: "center",
            }}
        >
            <Text>Hi!</Text>
        </View>
    );
};
