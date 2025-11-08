import { Invites } from "@/components/Invites";
import { Loading } from "@/components/primitives/Loading";
import { useSessions } from "@/providers/authed/SessionsProvider";
import { View } from "react-native";

const InviteRoute = () => {
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
            {isAppReady ? <Invites /> : <Loading />}
        </View>
    );
};

export default InviteRoute;
