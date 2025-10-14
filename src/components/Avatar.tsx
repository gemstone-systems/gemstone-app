import type { DidPlc } from "@/lib/types/atproto";
import { getBskyProfile } from "@/queries/get-profile";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Image, View, Text } from "react-native";

export const Avatar = React.memo(({ did }: { did: DidPlc }) => {
    const {
        data: profile,
        isPending,
        isError,
    } = useQuery({
        queryKey: [did],
        queryFn: async () => {
            return await getBskyProfile(did);
        },
    });

    return isPending ? (
        <View></View>
    ) : isError ? (
        <Text>:(</Text>
    ) : (
        profile && <Image source={{ uri: profile.avatar ?? profile.handle }} />
    );
});

Avatar.displayName = "Avatar";
