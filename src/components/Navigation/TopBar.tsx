import { GmstnLogoColor } from "@/components/icons/gmstn/GmstnLogoColor";
import { useFacet } from "@/lib/facet";
import { useProfile } from "@/providers/authed/ProfileProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { View } from "react-native";

export const TopBar = () => {
    const { atoms } = useFacet();
    const { profile } = useProfile();
    const { semantic } = useCurrentPalette();
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: 16,
                paddingVertical: 4,
                backgroundColor: semantic.backgroundDark,
                boxShadow: atoms.boxShadows.sm,
                zIndex: 2,
            }}
        >
            <Link href="/">
                <View style={{ padding: 8, paddingLeft: 12, paddingTop: 12 }}>
                    <GmstnLogoColor height={36} width={36} />
                </View>
            </Link>
            {profile?.avatar && (
                <Image
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: atoms.radii.full,
                    }}
                    source={{ uri: profile.avatar }}
                />
            )}
        </View>
    );
};
