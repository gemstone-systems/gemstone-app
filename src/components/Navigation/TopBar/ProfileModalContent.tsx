import { Text } from "@/components/primitives/Text";
import { useFacet } from "@/lib/facet";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { Link } from "expo-router";
import type { StyleProp, TextStyle } from "react-native";
import { Pressable, View } from "react-native";

export const ProfileModalContent = () => {
    const { semantic } = useCurrentPalette();
    const { atoms } = useFacet();

    const listItemStyles: StyleProp<TextStyle> = {
        paddingLeft: 16,
        paddingRight: 32,
    };

    return (
        <View
            style={{
                marginTop: 64,
                marginRight: 16,
                backgroundColor: semantic.surface,
                borderRadius: atoms.radii.lg,
                display: "flex",
                paddingVertical: 16,
                gap: 4,
            }}
        >
            <Link href="/profile" style={listItemStyles} asChild>
                <LinkText label="Profile" />
            </Link>
            <Link href="/invites" style={listItemStyles} asChild>
                <LinkText label="Invites" />
            </Link>
            <Link href="/settings" style={listItemStyles} asChild>
                <LinkText label="Settings" />
            </Link>
            <Link href="/preferences" style={listItemStyles} asChild>
                <LinkText label="Preferences" />
            </Link>
            <Link href="/logout" style={listItemStyles} asChild>
                <LinkText
                    label="Log out"
                    style={{ color: semantic.negative }}
                />
            </Link>
        </View>
    );
};

const LinkText = ({
    label,
    style,
    ...props
}: {
    label: string;
    style?: StyleProp<TextStyle>;
}) => {
    return (
        <Pressable {...props}>
            {({ hovered }) => (
                <Text
                    style={[
                        {
                            textDecorationLine: hovered ? "underline" : "none",
                        },
                        style,
                    ]}
                >
                    {label}
                </Text>
            )}
        </Pressable>
    );
};
