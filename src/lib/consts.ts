const __DEV__oAuthCallbackUrl = "http://127.0.0.1:8081/login/";

const oAuthScopes = ["atproto", "transition:generic"];

const oAuthScopesString = oAuthScopes
    .reduce((prev, curr) => `${prev} ${curr}`)
    .trim();

export const __DEV__loopbackOAuthMetadata = {
    client_id: `http://localhost?redirect_uri=${encodeURIComponent(__DEV__oAuthCallbackUrl)}&scope=${encodeURIComponent(oAuthScopesString)}`,
    redirect_uris: [__DEV__oAuthCallbackUrl],
    scope: oAuthScopesString,
    token_endpoint_auth_method: "none",
    response_types: ["code"],
    grant_types: ["authorization_code", "refresh_token"],
    application_type: "native",
    dpop_bound_access_tokens: true,
    subject_type: "public",
};
