import ChatComponentProfiled from "@/components/ChatComponentProfiled";
import { didPlcSchema } from "@/lib/types/atproto";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
    const { slug } = useLocalSearchParams();
    const { success, error, data: did } = didPlcSchema.safeParse(slug);
    if (!success) {
        console.error("slug was not a did plc");
        console.error(error);
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text>Provide a valid did:plc pls (no did web yet)</Text>
            </View>
        );
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ChatComponentProfiled did={did} />
        </View>
    );
}
