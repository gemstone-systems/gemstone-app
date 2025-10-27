import type { Did } from "@/lib/types/atproto";
import { type LatticeSessionInfo } from "@/lib/types/handshake";
import {
    httpSuccessResponseSchema,
    latticeHandshakeResponseSchema,
} from "@/lib/types/http/responses";
import type { SystemsGmstnDevelopmentChannelMembership } from "@/lib/types/lexicon/systems.gmstn.development.channel.membership";
import { getLatticeEndpointFromDid } from "@/lib/utils/gmstn";
import { requestInterServiceJwtFromPds } from "@/lib/utils/jwt";
import type { Result } from "@/lib/utils/result";
import type { OAuth } from "@/providers/OAuthProvider";
import { z } from "zod";

export const initiateHandshakeTo = async ({
    did,
    memberships,
    oauth,
}: {
    did: Did;
    memberships: Array<SystemsGmstnDevelopmentChannelMembership>;
    oauth: OAuth;
}): Promise<Result<LatticeSessionInfo, unknown>> => {
    const latticeUrlResult = await getLatticeEndpointFromDid(did);
    if (!latticeUrlResult.ok)
        return { ok: false, error: latticeUrlResult.error };

    let jwt = "";
    if (did.startsWith("did:web:localhost")) {
        if (__DEV__)
            jwt = await requestInterServiceJwtFromPds({ oauth, aud: did });
        else
            return {
                ok: false,
                error: `Cannot initiate handshake to a lattice at localhost. Provided handshake target's DID was ${did}`,
            };
    } else {
        // do proxy
        // for now we return error
        // FIXME: actually do service proxying.
        return { ok: false, error: "Service proxying not yet implemented" };
    }

    const latticeBaseUrl = latticeUrlResult.data.origin;

    const handshakeReq = new Request(`${latticeBaseUrl}/handshake`, {
        method: "POST",
        body: JSON.stringify({
            interServiceJwt: jwt,
            memberships,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const handshakeRes = await fetch(handshakeReq);
    const handshakeResponseData: unknown = await handshakeRes.json();

    const {
        success: httpResponseParseSuccess,
        error: httpResponseParseError,
        data: handshakeResponseDataParsed,
    } = httpSuccessResponseSchema.safeParse(handshakeResponseData);
    if (!httpResponseParseSuccess)
        return {
            ok: false,
            error: z.treeifyError(httpResponseParseError),
        };

    const { data: handshakeData } = handshakeResponseDataParsed;

    const {
        success: handshakeDataParseSuccess,
        error: handshakeDataParseError,
        data: handshakeDataParsed,
    } = latticeHandshakeResponseSchema.safeParse(handshakeData);
    if (!handshakeDataParseSuccess)
        return { ok: false, error: z.treeifyError(handshakeDataParseError) };

    const { sessionInfo } = handshakeDataParsed;

    return { ok: true, data: sessionInfo };
};
