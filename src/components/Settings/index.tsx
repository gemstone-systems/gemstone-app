import { LatticeSettings } from "@/components/Settings/LatticeSettings";
import { ShardSettings } from "@/components/Settings/ShardSettings";
import { View } from "react-native";

export const Settings = () => {
    return (
        <View
            style={{
                flex: 1,
                flexDirection: "column",
                padding: 32,
                gap: 16,
            }}
        >
            <ShardSettings />
            <LatticeSettings />
        </View>
    );
};
