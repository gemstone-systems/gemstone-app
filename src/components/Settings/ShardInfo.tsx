import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import type { AtUri } from "@/lib/types/atproto";
import type { SystemsGmstnDevelopmentShard } from "@/lib/types/lexicon/systems.gmstn.development.shard";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { getOwnerInfoFromShard } from "@/queries/get-owner-info-from-shard";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, X } from "lucide-react-native";
import { View } from "react-native";

export const ShardInfo = ({
    shard,
}: {
    shard: {
        uri: Required<AtUri>;
        value: SystemsGmstnDevelopmentShard;
    };
}) => {
    const shardDomain = shard.uri.rKey;
    const { isLoading, data: shardInfo } = useQuery({
        queryKey: ["shardInfo", shardDomain],
        queryFn: async () => {
            return await getOwnerInfoFromShard(shardDomain);
        },
    });
    const { semantic } = useCurrentPalette();

    return (
        <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <Text>{shardDomain}</Text>
                    {shardInfo ? (
                        shardInfo.registered ? (
                            <BadgeCheck
                                height={16}
                                width={16}
                                color={semantic.positive}
                            />
                        ) : (
                            <X
                                height={16}
                                width={16}
                                color={semantic.negative}
                            />
                        )
                    ) : (
                        <X height={16} width={16} color={semantic.negative} />
                    )}
                </>
            )}
        </View>
    );
};
