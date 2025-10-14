import { ExpoOAuthClient } from "@atproto/oauth-client-expo";

const oauthMetadata = {
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
export const oauthClient = new ExpoOAuthClient({
    clientMetadata: oauthMetadata,
    handleResolver: "https://bsky.social",
});
