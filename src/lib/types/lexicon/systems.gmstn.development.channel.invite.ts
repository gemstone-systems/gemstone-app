import { comAtprotoRepoStrongRefSchema } from "@/lib/types/atproto";
import { didSchema } from "@atproto/oauth-client";
import { z } from "zod";

export const systemsGmstnDevelopmentChannelInviteRecordSchema = z.object({
    $type: z.string(),
    channel: comAtprotoRepoStrongRefSchema,
    recipient: didSchema,
    createdAt: z.coerce.date(),
});
export type SystemsGmstnDevelopmentChannelInvite = z.infer<
    typeof systemsGmstnDevelopmentChannelInviteRecordSchema
>;
