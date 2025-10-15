import { z } from "zod";

export const didPlcSchema = z.templateLiteral(["did:plc:", z.string()]);

export type DidPlc = z.infer<typeof didPlcSchema>;

export const didWebSchema = z.templateLiteral(["did:web:", z.string()]);

export type DidWeb = z.infer<typeof didWebSchema>;
