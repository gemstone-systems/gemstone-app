import type { Did } from "@/lib/types/atproto";
import {
    systemsGmstnDevelopmentShardRecordSchema,
    type SystemsGmstnDevelopmentShard,
} from "@/lib/types/lexicon/systems.gmstn.development.shard";
import type { Result } from "@/lib/utils/result";
import { Client, simpleFetchHandler } from "@atcute/client";
import { z } from "zod";

// TODO: use prism instead of direct PDS lookup
export const getUserShards = async ({
    pdsEndpoint,
    did,
}: {
    pdsEndpoint: string;
    did: Did;
}): Promise<
    Result<
        Array<{
            uri: string;
            value: SystemsGmstnDevelopmentShard;
        }>,
        unknown
    >
> => {
    const handler = simpleFetchHandler({ service: pdsEndpoint });
    const client = new Client({ handler });
    const shardRecordsResult = await fetchRecords({
        client,
        did,
    });
    if (!shardRecordsResult.ok)
        return { ok: false, error: shardRecordsResult.error };
    return { ok: true, data: shardRecordsResult.data };
};

const fetchRecords = async ({
    client,
    did,
}: {
    client: Client;
    did: Did;
}): Promise<
    Result<
        Array<{
            uri: string;
            value: SystemsGmstnDevelopmentShard;
        }>,
        unknown
    >
> => {
    const allRecords: Array<{
        uri: string;
        value: SystemsGmstnDevelopmentShard;
    }> = [];
    let cursor: string | undefined;

    let continueLoop = true;

    while (continueLoop) {
        const results = await client.get("com.atproto.repo.listRecords", {
            params: {
                repo: did,
                collection: "systems.gmstn.development.shard",
                limit: 100,
                cursor,
            },
        });
        if (!results.ok)
            return {
                ok: false,
                error: "Failed to fetch records. Check the response from PDS.",
            };
        const { records, cursor: nextCursor } = results.data;

        const {
            success,
            error,
            data: responses,
        } = z
            .array(
                z.object({
                    cid: z.string(),
                    uri: z.string(),
                    value: systemsGmstnDevelopmentShardRecordSchema,
                }),
            )
            .safeParse(records);

        if (!success) return { ok: false, error: z.treeifyError(error) };

        allRecords.push(
            ...responses.map((data) => {
                return { uri: data.uri, value: data.value };
            }),
        );

        if (records.length < 100) continueLoop = false;
        cursor = nextCursor;
    }
    return { ok: true, data: allRecords };
};
