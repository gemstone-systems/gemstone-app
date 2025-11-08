import type { Did } from "@/lib/types/atproto";
import type { SystemsGmstnDevelopmentChannelInvite } from "@/lib/types/lexicon/systems.gmstn.development.channel.invite";
import { systemsGmstnDevelopmentChannelInviteRecordSchema } from "@/lib/types/lexicon/systems.gmstn.development.channel.invite";
import type { Result } from "@/lib/utils/result";
import { Client, simpleFetchHandler } from "@atcute/client";
import { z } from "zod";

// NOTE: might eventually want to put this into Prism as well.
export const getInviteRecordsFromPds = async ({
    pdsEndpoint,
    did,
}: {
    pdsEndpoint: string;
    did: Did;
}): Promise<
    Result<
        Array<{
            cid: string;
            uri: string;
            value: SystemsGmstnDevelopmentChannelInvite;
        }>,
        unknown
    >
> => {
    const handler = simpleFetchHandler({ service: pdsEndpoint });
    const client = new Client({ handler });
    const channelRecordsResult = await fetchRecords({
        client,
        did,
    });
    if (!channelRecordsResult.ok)
        return { ok: false, error: channelRecordsResult.error };
    return { ok: true, data: channelRecordsResult.data };
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
            cid: string;
            uri: string;
            value: SystemsGmstnDevelopmentChannelInvite;
        }>,
        unknown
    >
> => {
    const allRecords: Array<{
        cid: string;
        uri: string;
        value: SystemsGmstnDevelopmentChannelInvite;
    }> = [];
    let cursor: string | undefined;

    let continueLoop = true;

    while (continueLoop) {
        const results = await client.get("com.atproto.repo.listRecords", {
            params: {
                repo: did,
                collection: "systems.gmstn.development.channel.invite",
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
                    value: systemsGmstnDevelopmentChannelInviteRecordSchema,
                }),
            )
            .safeParse(records);
        if (!success) return { ok: false, error: z.treeifyError(error) };

        allRecords.push(...responses);

        if (records.length < 100) continueLoop = false;
        cursor = nextCursor;
    }
    return { ok: true, data: allRecords };
};
