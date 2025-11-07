import {
    getOwnerDidResponseSchema,
    httpSuccessResponseSchema,
} from "@/lib/types/http/responses";
import { z } from "zod";

export const getOwnerInfoFromShard = async (shardDomain: string) => {
    const reqUrl = new URL(
        (shardDomain.startsWith("localhost")
            ? `http://${shardDomain}`
            : `https://${shardDomain}`) +
            "/xrpc/systems.gmstn.development.shard.getOwner",
    );
    const req = new Request(reqUrl);
    const res = await fetch(req);
    const data: unknown = await res.json();

    const {
        success: httpResponseParseSuccess,
        error: httpResponseParseError,
        data: httpResponse,
    } = httpSuccessResponseSchema.safeParse(data);
    if (!httpResponseParseSuccess) {
        console.error(
            "Could not get shard's owner info.",
            z.treeifyError(httpResponseParseError),
        );
        return;
    }

    const {
        success,
        error,
        data: result,
    } = getOwnerDidResponseSchema.safeParse(httpResponse.data);

    if (!success) {
        console.error(
            "Could not get shard's owner info.",
            z.treeifyError(error),
        );
        return;
    }
    return result;
};
