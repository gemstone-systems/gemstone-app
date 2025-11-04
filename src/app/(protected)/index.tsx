import { Home } from "@/components/Home";
import { Loading } from "@/components/primitives/Loading";
import { useSessions } from "@/providers/authed/SessionsProvider";
import { View } from "react-native";

export default function Index() {
    const { isInitialising } = useSessions();

    const isAppReady = !isInitialising;
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "stretch",
            }}
        >
            {isAppReady ? <Home /> : <Loading />}
        </View>
    );
}
