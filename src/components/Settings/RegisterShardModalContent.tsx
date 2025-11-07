import { Text } from "@/components/primitives/Text";
import { useFacet } from "@/lib/facet";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { TextInput, View } from "react-native";

export const RegisterShardModalContent = () => {
    const { semantic } = useCurrentPalette();
    const { atoms } = useFacet();

    return (
        <View
            style={{
                backgroundColor: semantic.surface,
                borderRadius: atoms.radii.lg,
                display: "flex",
                gap: 4,
            }}
        >
            <TextInput placeholder="Hihihihiihihih" />
            <Text>Hello</Text>
        </View>
    );
};
