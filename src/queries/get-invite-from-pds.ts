import type { AtUri } from "@/lib/types/atproto";
import type { SystemsGmstnDevelopmentChannelInvite } from "@/lib/types/lexicon/systems.gmstn.development.channel.invite";
import { systemsGmstnDevelopmentChannelInviteRecordSchema } from "@/lib/types/lexicon/systems.gmstn.development.channel.invite";
import { getRecordFromFullAtUri } from "@/lib/utils/atproto";
import type { Result } from "@/lib/utils/result";

export const getInviteFromPds = async (
    atUri: Required<AtUri>,
): Promise<Result<SystemsGmstnDevelopmentChannelInvite, unknown>> => {
    const record = await getRecordFromFullAtUri(atUri);
    if (!record.ok) return { ok: false, error: record.error };

    const {
        success,
        error,
        data: invite,
    } = systemsGmstnDevelopmentChannelInviteRecordSchema.safeParse(record.data);
    if (!success) return { ok: false, error };

    return { ok: true, data: invite };
};
