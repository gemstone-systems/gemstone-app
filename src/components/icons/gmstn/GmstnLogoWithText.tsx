import { GmstnLogo } from "@/components/icons/gmstn/GmstnLogo";
import { Text } from "@/components/primitives/Text";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { View } from "react-native";

export const GmstnLogoWithText = () => {
    const { semantic } = useCurrentPalette();
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
            }}
        >
            <GmstnLogo
                fill={semantic.primary}
                style={{ height: 32, width: 32 }}
            />
            <Text style={{ fontWeight: 400 }}>Gemstone</Text>
        </View>
    );
};
