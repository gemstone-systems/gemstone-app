import { Text } from "@/components/primitives/Text";
import { useFacet } from "@/lib/facet";
import type { Did } from "@/lib/types/atproto";
import { getBskyProfile } from "@/queries/get-profile";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";

export const Name = React.memo(({ did }: { did: Did }) => {
    const {
        data: profile,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["profile", did],
        queryFn: async () => {
            return await getBskyProfile(did);
        },
    });

    const { typography } = useFacet();

    return isPending ? (
        <View></View>
    ) : isError ? (
        <Text>:(</Text>
    ) : (
        profile && (
            <Text
                style={{ fontWeight: typography.weights.extralight.toString() }}
            >
                {profile.displayName ?? profile.handle}
            </Text>
        )
    );
});

Name.displayName = "Name";
