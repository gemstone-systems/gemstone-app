import { Text } from "@/components/primitives/Text";
import { useFacet } from "@/lib/facet";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { View } from "react-native";

export const ShardSettings = () => {
    const { semantic } = useCurrentPalette();
    const { atoms, typography } = useFacet();

    return (
        <View
            style={{
                borderWidth: 1,
                borderColor: semantic.borderVariant,
                borderRadius: atoms.radii.lg,
                padding: 8,
            }}
        >
            <Text
                style={[
                    typography.weights.byName.medium,
                    typography.sizes.lg,
                    {
                        paddingLeft: 8,
                    },
                ]}
            >
                Shards
            </Text>
        </View>
    );
};
