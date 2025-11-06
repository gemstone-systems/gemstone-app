import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import { useFacet } from "@/lib/facet";
import { useProfile } from "@/providers/authed/ProfileProvider";
import { View } from "react-native";

export const Home = () => {
    const { profile, isLoading } = useProfile();
    const { typography } = useFacet();

    return (
        <View
            style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {isLoading ? (
                <Loading />
            ) : !profile ? (
                <Text>Couldn&apos;t load profile :(</Text>
            ) : (
                <>
                    <Text style={[typography.sizes.lg]}>
                        Welcome to Gemstone!
                    </Text>
                    <Text style={[typography.sizes.lg]}>
                        Channels are on the left :D
                    </Text>
                </>
            )}
        </View>
    );
};
