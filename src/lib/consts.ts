export const __DEV__loopbackOAuthMetadata = {
    client_id: `http://localhost?redirect_uri=${encodeURIComponent("http://127.0.0.1/")}`,
    redirect_uris: ["http://127.0.0.1:8081/"],
    scope: "atproto",
    token_endpoint_auth_method: "none",
    response_types: ["code"],
    grant_types: ["authorization_code", "refresh_token"],
    application_type: "native",
    dpop_bound_access_tokens: true,
    subject_type: "public",
};
