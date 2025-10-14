import { ExpoOAuthClient } from "expo-atproto-auth";

export const oauthClient = new ExpoOAuthClient({
    clientMetadata: undefined,
    handleResolver: "https://bsky.social",
});
