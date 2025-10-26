import type { Did } from "@/lib/types/atproto";
import {
    systemsGmstnDevelopmentChannelMembershipRecordSchema,
    type SystemsGmstnDevelopmentChannelMembership,
} from "@/lib/types/lexicon/systems.gmstn.development.channel.membership";
import type { Result } from "@/lib/utils/result";
import { Client, simpleFetchHandler } from "@atcute/client";
import { z } from "zod";

// NOTE: might eventually want to put this into Prism as well.
export const getMembershipRecordsFromPds = async ({
    pdsEndpoint,
    did,
}: {
    pdsEndpoint: string;
    did: Did;
}): Promise<
    Result<Array<SystemsGmstnDevelopmentChannelMembership>, unknown>
> => {
    const handler = simpleFetchHandler({ service: pdsEndpoint });
    const client = new Client({ handler });
    const membershipRecordsResult = await fetchRecords({
        client,
        did,
    });
    if (!membershipRecordsResult.ok)
        return { ok: false, error: membershipRecordsResult.error };
    return { ok: true, data: membershipRecordsResult.data };
};

const fetchRecords = async ({
    client,
    did,
}: {
    client: Client;
    did: Did;
}): Promise<
    Result<Array<SystemsGmstnDevelopmentChannelMembership>, unknown>
> => {
    const allRecords: Array<SystemsGmstnDevelopmentChannelMembership> = [];
    let cursor: string | undefined;

    let continueLoop = true;

    while (continueLoop) {
        const results = await client.get("com.atproto.repo.listRecords", {
            params: {
                repo: did,
                collection: "systems.gmstn.development.channel.membership",
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

        const { success, error, data } = z
            .array(systemsGmstnDevelopmentChannelMembershipRecordSchema)
            .safeParse(records);

        if (!success) return { ok: false, error: z.treeifyError(error) };

        allRecords.push(...data);

        if (records.length < 100) continueLoop = false;
        cursor = nextCursor;
    }
    return { ok: true, data: allRecords };
};
