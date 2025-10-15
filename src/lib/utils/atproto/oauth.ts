import type {
    AuthorizeOptions,
    BrowserOAuthClient,
    OAuthSession,
} from "@atproto/oauth-client-browser";
import type { ExpoOAuthClientOptions } from "@atproto/oauth-client-expo";
import { ExpoOAuthClient as PbcExpoOAuthClient } from "@atproto/oauth-client-expo";

const oAuthMetadata = {
    client_id: "https://app.gmstn.systems/oauth-client-metadata.json",
    client_name: "Gemstone",
    client_uri: "https://app.gmstn.systems",
    redirect_uris: ["systems.gmstn.app:/oauth/callback"],
    scope: "atproto transition:generic",
    token_endpoint_auth_method: "none",
    response_types: ["code"],
    grant_types: ["authorization_code", "refresh_token"],
    application_type: "native",
    dpop_bound_access_tokens: true,
};

// suuuuuch a hack holy shit
export type TypedExpoOAuthClient = new (
    options: ExpoOAuthClientOptions,
) => TypedExpoOAuthClientInstance;

export interface TypedExpoOAuthClientInstance extends BrowserOAuthClient {
    signIn(signIn: string, options?: AuthorizeOptions): Promise<OAuthSession>;
    handleCallback(): Promise<null | OAuthSession>;
}

// i cast type magic
const ExpoOAuthClient = PbcExpoOAuthClient as unknown as TypedExpoOAuthClient;

export const oAuthClient = new ExpoOAuthClient({
    //@ts-expect-error funky wunky with typey wypies
    clientMetadata: undefined,
    handleResolver: "https://bsky.social",
});

const result = oAuthClient.init();
console.log(result);
