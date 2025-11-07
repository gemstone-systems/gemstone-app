import type { Did, Nsid } from "@/lib/types/atproto";
import type { OAuthContextValue } from "@/providers/OAuthProvider";

/**
 * Requests an {@link https://atproto.com/specs/xrpc#inter-service-authentication-jwt|Inter Service JWT} from the PDS of the currently logged in user.
 * Likely not to be used in production. Generally speaking, for production, we will use service proxying to achieve what we want.
 * @param {object} params - An object containing the expected parameters of this function.
 * @param {object} params.oauth - Required. An OAuth object from the OAuth provider (OAuthProvider, useOAuth()[0]).
 * @param {string} params.aud - Required. The DID of the audience. Specifically, the DID of the receiving service that will perform verification of the JWT on their end.
 * @param {string} [params.exp] - Optional. Time in unix epoch *seconds* that the JWT expires.
 * @param {string} [params.lxm] - Optional. Lexicon (XRPC) method to bind the requested token to. Must be a valid ATProto NSID
 */
export const requestInterServiceJwtFromPds = async ({
    oauth,
    aud,
    exp,
    lxm,
}: {
    oauth: OAuthContextValue;
    aud: Did;
    exp?: number;
    lxm?: Nsid;
}) => {
    if (!oauth.agent)
        throw new Error(
            "OAuth was not intialised before attempting to request a service JWT from user's PDS.",
        );

    const res = await oauth.agent.com.atproto.server.getServiceAuth({
        aud,
        exp,
        lxm,
    });

    return res.data.token;
};
