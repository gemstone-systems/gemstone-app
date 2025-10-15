import { isDevMode } from "@/lib/utils/env";
import type {
    AuthorizeOptions,
    BrowserOAuthClient,
    OAuthSession,
} from "@atproto/oauth-client-browser";
import type { ExpoOAuthClientOptions } from "@atproto/oauth-client-expo";
import { ExpoOAuthClient as PbcWebExpoOAuthClient } from "@atproto/oauth-client-expo";
import oAuthMetadata from "../../../../assets/oauth-client-metadata.json";

// suuuuuch a hack holy shit
export type TypedExpoOAuthClient = new (
    options: ExpoOAuthClientOptions,
) => TypedExpoOAuthClientInstance;

export interface TypedExpoOAuthClientInstance extends BrowserOAuthClient {
    signIn(signIn: string, options?: AuthorizeOptions): Promise<OAuthSession>;
    handleCallback(): Promise<null | OAuthSession>;
}

// i cast type magic
const ExpoOAuthClient = PbcWebExpoOAuthClient as unknown as TypedExpoOAuthClient;

export const oAuthClient = new ExpoOAuthClient({
    // @ts-expect-error funky wunky with typey wypies
    clientMetadata: isDevMode ? undefined : oAuthMetadata,
    handleResolver: "https://bsky.social",
});

oAuthClient
    .init()
    .then((result) => {
        if (result && isDevMode) {
            const { session, state } = result;
            if (state != null) {
                console.log(
                    `${session.sub} was successfully authenticated (state: ${state})`,
                );
            } else {
                console.log(
                    `${session.sub} was restored (last active session)`,
                );
            }
        }
    })
    .catch((err: unknown) => {
        console.error(
            "something went wrong when trying to init the oauth client.",
        );
        console.error(err);
    });
