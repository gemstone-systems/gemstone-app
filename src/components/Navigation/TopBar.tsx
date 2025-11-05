import { GmstnLogoColor } from "@/components/icons/gmstn/GmstnLogoColor";
import { Link } from "expo-router";
import { View } from "react-native";

export const TopBar = () => {
    return (
        <Link href="/">
            <View style={{ padding: 8, paddingLeft: 12, paddingTop: 12 }}>
                <GmstnLogoColor height={36} width={36} />
            </View>
        </Link>
    );
};
