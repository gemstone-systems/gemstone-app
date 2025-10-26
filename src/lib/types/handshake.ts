import { atUriSchema, didSchema } from "@/lib/types/atproto";
import { z } from "zod";

export const latticeSessionInfoSchema = z.object({
    id: z.string(),
    token: z.string(),
    fingerprint: z.string(),
    allowedChannels: z.array(atUriSchema),
    clientDid: didSchema,
    latticeDid: didSchema,
});
export type LatticeSessionInfo = z.infer<typeof latticeSessionInfoSchema>;
