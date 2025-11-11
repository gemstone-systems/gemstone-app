import { isDevMode } from "@/lib/utils/env";
import type {
    AuthorizeOptions,
    BrowserOAuthClient,
    OAuthSession,
} from "@atproto/oauth-client-browser";
import type { ExpoOAuthClientOptions } from "@atproto/oauth-client-expo";
import { ExpoOAuthClient as PbcWebExpoOAuthClient } from "@atproto/oauth-client-expo";
import oAuthMetadata from "../../../../public/oauth-client-metadata.json";
import { __DEV__loopbackOAuthMetadata } from "@/lib/consts";

// suuuuuch a hack holy shit
export type TypedExpoOAuthClient = new (
    options: ExpoOAuthClientOptions,
) => TypedExpoOAuthClientInstance;

export interface TypedExpoOAuthClientInstance extends BrowserOAuthClient {
    signIn(signIn: string, options?: AuthorizeOptions): Promise<OAuthSession>;
    handleCallback(): Promise<null | OAuthSession>;
}

// i cast type magic
export const ExpoOAuthClient =
    PbcWebExpoOAuthClient as unknown as TypedExpoOAuthClient;

export const oAuthClient = new ExpoOAuthClient({
    // @ts-expect-error funky wunky with typey wypies
    clientMetadata: isDevMode ? __DEV__loopbackOAuthMetadata : oAuthMetadata,
    handleResolver: "https://bsky.social",
});
