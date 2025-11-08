import { didSchema, type Did } from "@/lib/types/atproto";
import { getConstellationBacklinks } from "@/lib/utils/constellation";
import type { Result } from "@/lib/utils/result";
import { z } from "zod";

// TODO: use prism instead of constellation, so that we can get the full record
// in the future. that way we can track the status of an invite.
export const getInvitesFromConstellation = async (
    did: Did,
): Promise<
    Result<
        {
            invites: Array<{
                did: `did:${string}:${string}`;
                collection: "systems.gmstn.development.channel.invite";
                rkey: string;
            }>;
        },
        unknown
    >
> => {
    // FIXME: If there are too many records, we can't get them all
    // because we aren't tracking the cursor and looping calls to get the backlinks
    const backlinksResult = await getConstellationBacklinks({
        subject: did,
        source: {
            nsid: "systems.gmstn.development.channel.invite",
            fieldName: "recipient",
        },
    });

    if (!backlinksResult.ok) return { ok: false, error: backlinksResult.error };

    const {
        success,
        error,
        data: records,
    } = z
        .array(
            z.object({
                did: didSchema,
                collection: z.literal(
                    "systems.gmstn.development.channel.invite",
                ),
                rkey: z.string(),
            }),
        )
        .safeParse(backlinksResult.data.records);

    if (!success) return { ok: false, error };

    return {
        ok: true,
        data: {
            invites: [...records],
        },
    };
};
