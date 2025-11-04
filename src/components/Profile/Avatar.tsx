import { Text } from "@/components/primitives/Text";
import type { Did } from "@/lib/types/atproto";
import { getBskyProfile } from "@/queries/get-profile";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Image, View } from "react-native";

export const Avatar = React.memo(({ did }: { did: Did }) => {
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
        profile && (
            <Image
                style={{
                    width: 32,
                    height: 32,
                    borderRadius: 2000000000,
                }}
                source={{ uri: profile.avatar ?? profile.handle }}
            />
        )
    );
});

Avatar.displayName = "Avatar";
