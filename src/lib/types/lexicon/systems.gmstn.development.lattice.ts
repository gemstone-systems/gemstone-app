import { z } from "zod";

export const systemsGmstnDevelopmentLattice = z.object({
    $type: z.string(),
    createdAt: z.coerce.date(),
    description: z.string(),
});

export type SystemsGmstnDevelopmentLattice = z.infer<
    typeof systemsGmstnDevelopmentLattice
>;
