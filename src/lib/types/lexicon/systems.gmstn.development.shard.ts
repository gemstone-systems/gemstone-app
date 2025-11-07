import { z } from "zod";

export const systemsGmstnDevelopmentShard = z.object({
    $type: z.string(),
    createdAt: z.coerce.date(),
    description: z.string(),
});

export type SystemsGmstnDevelopmentShard = z.infer<
    typeof systemsGmstnDevelopmentShard
>;
