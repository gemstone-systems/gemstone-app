import { GmstnLogoColor } from "@/components/icons/gmstn/GmstnLogoColor";
import { ProfileModalContent } from "@/components/Navigation/TopBar/ProfileModalContent";
import { useFacet } from "@/lib/facet";
import { useProfile } from "@/providers/authed/ProfileProvider";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, View } from "react-native";

export const TopBar = () => {
    const { atoms } = useFacet();
    const { profile } = useProfile();
    const { semantic } = useCurrentPalette();
    const [showProfileModal, setShowProfileModal] = useState(false);

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
            <Modal
                visible={showProfileModal}
                transparent
                onRequestClose={() => {
                    setShowProfileModal(!showProfileModal);
                }}
            >
                <Pressable
                    style={{ flex: 1, cursor: "auto" }}
                    onPress={() => {
                        setShowProfileModal(false);
                    }}
                >
                    <Pressable
                        style={{
                            flex: 0,
                            cursor: "auto",
                            alignItems: "flex-end",
                        }}
                        onPress={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <ProfileModalContent />
                    </Pressable>
                </Pressable>
            </Modal>
            <Pressable
                hitSlop={20}
                onPress={() => {
                    setShowProfileModal(true);
                }}
            >
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
            </Pressable>
        </View>
    );
};
