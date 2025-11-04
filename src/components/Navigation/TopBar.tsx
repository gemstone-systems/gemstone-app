import { GmstnLogoColor } from "@/components/icons/gmstn/GmstnLogoColor";
import { View } from "react-native";

export const TopBar = () => {
    return (
        <View style={{ padding: 8, paddingLeft: 12, paddingTop: 12 }}>
            <GmstnLogoColor height={36} width={36} />
        </View>
    );
};
