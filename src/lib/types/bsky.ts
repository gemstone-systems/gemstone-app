import { AppBskyActorProfile as AtcuteAppBskyActorProfile } from "@atcute/bluesky";
import { z } from "zod";

export const appBskyActorProfileSchema = z.object(
    AtcuteAppBskyActorProfile.mainSchema,
);

export type AppBskyActorProfile = z.infer<typeof appBskyActorProfileSchema>;
