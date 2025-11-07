import type { HexCode } from "@/lib/facet/src/lib/colors";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { ActivityIndicator, View } from "react-native";

export const Loading = ({
    color,
    size,
}: {
    color?: HexCode;
    size?: number | "large" | "small";
}) => {
    const { semantic } = useCurrentPalette();
    return (
        <View>
            <ActivityIndicator
                size={size ?? "large"}
                color={color ?? semantic.primary}
            />
        </View>
    );
};
