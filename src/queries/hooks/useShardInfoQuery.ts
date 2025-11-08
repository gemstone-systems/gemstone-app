import { getOwnerInfoFromShard } from "@/queries/get-owner-info-from-shard";
import { useQuery } from "@tanstack/react-query";

export const useShardInfoQuery = (shardDomain: string) => {
    const queryKey = ["shardInfo", shardDomain];
    return {
        queryKey,
        useQuery: () =>
            useQuery({
                queryKey,
                queryFn: async () => {
                    return await getOwnerInfoFromShard(shardDomain);
                },
                retry: 1,
            }),
    };
};
