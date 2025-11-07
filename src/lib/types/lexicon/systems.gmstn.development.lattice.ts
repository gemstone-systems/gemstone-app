import { z } from "zod";

export const systemsGmstnDevelopmentLatticeRecordSchema = z.object({
    $type: z.string(),
    createdAt: z.coerce.date(),
    description: z.string(),
});

export type SystemsGmstnDevelopmentLattice = z.infer<
    typeof systemsGmstnDevelopmentLatticeRecordSchema
>;
