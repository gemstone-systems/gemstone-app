import type { HexCode } from "@/lib/facet/src/palette";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { ActivityIndicator, View } from "react-native";

export const Loading = ({ color }: { color?: HexCode }) => {
    const { semantic } = useCurrentPalette()
    return (
        <View>
            <ActivityIndicator size="large" color={color ?? semantic.primary} />
        </View>
    );
};
