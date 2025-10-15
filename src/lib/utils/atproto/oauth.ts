import { isDevMode } from "@/lib/utils/env";
import type {
    AuthorizeOptions,
    OAuthClient,
    OAuthSession,
} from "@atproto/oauth-client";
import type {
    ExpoOAuthClientOptions} from "@atproto/oauth-client-expo";
import {
    ExpoOAuthClient as PbcNativeExpoOAuthClient,
} from "@atproto/oauth-client-expo";
import oAuthMetadata from "../../../../assets/oauth-client-metadata.json";

// suuuuuch a hack holy shit
export type TypedExpoOAuthClient = new (
    options: ExpoOAuthClientOptions,
) => TypedExpoOAuthClientInstance;

export interface TypedExpoOAuthClientInstance extends OAuthClient {
    signIn(signIn: string, options?: AuthorizeOptions): Promise<OAuthSession>;
    handleCallback(): Promise<null | OAuthSession>;
}

// i cast type magic
const ExpoOAuthClient =
    PbcNativeExpoOAuthClient as unknown as TypedExpoOAuthClient;

export const oAuthClient = new ExpoOAuthClient({
    // @ts-expect-error funky wunky with typey wypies
    clientMetadata: isDevMode ? undefined : oAuthMetadata,
    handleResolver: "https://bsky.social",
});
