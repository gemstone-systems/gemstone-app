import { isDevMode } from "@/lib/utils/env";
import type {
    AuthorizeOptions,
    OAuthClient,
    OAuthSession,
} from "@atproto/oauth-client";
import type { ExpoOAuthClientOptions } from "@atproto/oauth-client-expo";
import { ExpoOAuthClient as PbcNativeExpoOAuthClient } from "@atproto/oauth-client-expo";
import oAuthMetadata from "../../../../assets/oauth-client-metadata.json";
import { __DEV__loopbackOAuthMetadata } from "@/lib/consts";

// suuuuuch a hack holy shit
export type TypedExpoOAuthClient = new (
    options: ExpoOAuthClientOptions,
) => TypedExpoOAuthClientInstance;

export interface TypedExpoOAuthClientInstance extends OAuthClient {
    signIn(signIn: string, options?: AuthorizeOptions): Promise<OAuthSession>;
    handleCallback(): Promise<null | OAuthSession>;
    // NOTE: ensure that whatever implementation you end up with, you also implement a similar function for this on native.
    init(): Promise<
        | {
              session: OAuthSession;
              state?: never;
          }
        | {
              session: OAuthSession;
              state: string | null;
          }
        | undefined
    >;
}

// i cast type magic
export const ExpoOAuthClient =
    PbcNativeExpoOAuthClient as unknown as TypedExpoOAuthClient;

export const oAuthClient = new ExpoOAuthClient({
    // @ts-expect-error funky wunky with typey wypies
    clientMetadata: isDevMode ? __DEV__loopbackOAuthMetadata : oAuthMetadata,
    handleResolver: "https://bsky.social",
});
