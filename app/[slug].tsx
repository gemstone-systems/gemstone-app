import ChatComponentProfiled from "@/app/components/ChatComponentProfiled";
import { capitalise } from "@/app/lib/utils/strings";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
    const { slug } = useLocalSearchParams();
    const name = typeof slug === "string" ? slug : slug[0];
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Hi, {capitalise(name)}!</Text>
            <ChatComponentProfiled />
        </View>
    );
}
