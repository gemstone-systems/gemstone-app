import { useFacet } from "@/lib/facet";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import type { ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";
// eslint-disable-next-line no-restricted-imports -- This is the component in question. We are re-exporting RN's base text component.
import { Text as RnText } from "react-native";

export const Text = ({
    children,
    style,
    ...props
}: {
    children: ReactNode;
    style?: StyleProp<TextStyle>;
}) => {
    const { typography } = useFacet();
    const { semantic } = useCurrentPalette();

    return (
        <RnText
            {...props}
            style={[
                {
                    fontFamily: typography.families.primary,
                    fontWeight: 300,
                    color: semantic.text,
                },
                style,
            ]}
        >
            {children}
        </RnText>
    );
};
