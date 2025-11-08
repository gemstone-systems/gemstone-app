import type { AtUri } from "@/lib/types/atproto";
import { stringToAtUri } from "@/lib/utils/atproto";
import { getUserShards } from "@/queries/get-shards-from-pds";
import type { OAuthSession } from "@atproto/oauth-client";
import { useQuery } from "@tanstack/react-query";

export const useShardsQuery = (session: OAuthSession) => {
    const queryKey = ["shards", session.did];
    return {
        queryKey,
        useQuery: () => useQuery({
            queryKey: queryKey,
            queryFn: async () => {
                return await shardsQueryFn(session);
            },
        }),
    };
};

const shardsQueryFn = async (session: OAuthSession) => {
    const shards = await getUserShards({
        pdsEndpoint: session.serverMetadata.issuer,
        did: session.did,
    });

    if (!shards.ok) {
        console.error("shardQueryFn error.", shards.error);
        throw new Error(
            `Something went wrong while getting the user's shard records.}`,
        );
    }

    const results = shards.data
        .map((record) => {
            const convertResult = stringToAtUri(record.uri);
            if (!convertResult.ok) {
                console.error(
                    "Could not convert",
                    record,
                    "into at:// URI object.",
                    convertResult.error,
                );
                return;
            }
            if (!convertResult.data.collection || !convertResult.data.rKey) {
                console.error(
                    record,
                    "did not convert to a full at:// URI with collection and rkey.",
                );
                return;
            }
            const uri: Required<AtUri> = {
                authority: convertResult.data.authority,
                collection: convertResult.data.collection,
                rKey: convertResult.data.rKey,
            };
            return { cid: record.cid, uri, value: record.value };
        })
        .filter((atUri) => atUri !== undefined);

    return results;
};
