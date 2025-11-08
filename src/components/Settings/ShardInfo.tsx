import { Loading } from "@/components/primitives/Loading";
import { Text } from "@/components/primitives/Text";
import type { AtUri } from "@/lib/types/atproto";
import type { SystemsGmstnDevelopmentShard } from "@/lib/types/lexicon/systems.gmstn.development.shard";
import { useCurrentPalette } from "@/providers/ThemeProvider";
import { useShardInfoQuery } from "@/queries/hooks/useShardInfoQuery";
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
    const { useQuery } = useShardInfoQuery(shardDomain);
    const { isLoading, data: shardInfo } = useQuery();
    const { semantic } = useCurrentPalette();

    return (
        <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            {isLoading ? (
                <Loading size="small" />
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
