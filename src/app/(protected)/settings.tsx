import { Loading } from "@/components/primitives/Loading";
import { Settings } from "@/components/Settings";
import { useSessions } from "@/providers/authed/SessionsProvider";
import { View } from "react-native";

const SettingsRoute = () => {
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
            {isAppReady ? <Settings /> : <Loading />}
        </View>
    );
};

export default SettingsRoute;
