import {
    oAuthClient,
    type TypedExpoOAuthClientInstance,
} from "@/lib/utils/atproto/oauth";
import { isDevMode } from "@/lib/utils/env";
import { Agent } from "@atproto/api";
import type { OAuthSession } from "@atproto/oauth-client";
import type { ReactNode, Dispatch } from "react";
import { createContext, useContext, useEffect, useState } from "react";

export interface OAuth {
    session?: OAuthSession;
    agent?: Agent;
    client?: TypedExpoOAuthClientInstance;
    isLoading: boolean;
}

const OAuthContext = createContext<[OAuth, Dispatch<OAuth> | undefined]>([
    { session: undefined, agent: undefined, isLoading: true },
    undefined,
]);

export const OAuthProvider = ({ children }: { children: ReactNode }) => {
    const providedOAuthClient = oAuthClient;
    const [oAuth, setOAuth] = useState<OAuth>({
        session: undefined,
        agent: undefined,
        client: providedOAuthClient,
        isLoading: true,
    });

    useEffect(() => {
        const initOAuth = async () => {
            try {
                const result = await providedOAuthClient.init();
                if (result && isDevMode) {
                    const { session, state } = result;
                    console.log("session state:", state);
                    if (state != null) {
                        console.log(
                            `${session.sub} was successfully authenticated (state: ${state})`,
                        );
                    } else {
                        console.log(
                            `${session.sub} was restored (last active session), token_endpoint: ${session.serverMetadata.token_endpoint}`,
                        );
                    }
                    const agent = new Agent(session);
                    setOAuth({
                        session,
                        agent,
                        client: providedOAuthClient,
                        isLoading: false,
                    });
                    return;
                }
                setOAuth((o) => ({
                    ...o,
                    isLoading: false,
                }));
                return;
            } catch (err: unknown) {
                console.error(
                    "something went wrong when trying to init the oauth client.",
                );
                console.error(err);
            }
        };

        console.log("initOAuth start");

        initOAuth()
            .then(() => {
                console.log("initOAuth end");
            })
            .catch((err: unknown) => {
                console.error(
                    "something went wrong when trying to init the oauth client.",
                );
                console.error(err);
            });

        if (isDevMode) {
            console.log("finished initialising oauth client");
        }
    }, [providedOAuthClient]);

    return <OAuthContext value={[oAuth, setOAuth]}>{children}</OAuthContext>;
};

export const useOAuth = () => {
    return useContext(OAuthContext);
};

export const useOAuthValue = () => {
    const [oAuth] = useContext(OAuthContext);
    return oAuth;
};

export const useSetOAuthValue = () => {
    const [, setOAuth] = useContext(OAuthContext);
    return setOAuth;
};

export const useOAuthSession = () => {
    const [oAuth] = useContext(OAuthContext);
    return oAuth.session;
};

export const useOAuthAgent = () => {
    const [oAuth] = useContext(OAuthContext);
    return oAuth.agent;
};

export const useOAuthClient = () => {
    const [oAuth] = useContext(OAuthContext);
    return oAuth.client;
};
