import { z } from "zod";

export const HttpGeneralErrorType = {
    TYPE_ERROR: "Type error",
    PARAMS_ERROR: "Missing required params",
    SERVER_ERROR: "Something went wrong on the server",
};
export const httpGeneralErrorTypeSchema = z.enum(HttpGeneralErrorType);
// eslint-disable-next-line @typescript-eslint/no-redeclare -- intentional. lets us have enum-like objects without some of the weirdness
export type HttpGeneralErrorType = z.infer<typeof httpGeneralErrorTypeSchema>;

export const httpErrorTypeSchema = z.union([httpGeneralErrorTypeSchema]);
export type HttpErrorType = z.infer<typeof httpErrorTypeSchema>;

export const httpResponseErrorInfoSchema = z.object({
    message: z.string(),
    type: z.optional(httpErrorTypeSchema),
    details: z.optional(z.unknown()),
});
export type HttpResponseErrorInfo = z.infer<typeof httpResponseErrorInfoSchema>;
