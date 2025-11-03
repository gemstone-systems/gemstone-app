import {
    oAuthClient,
    type TypedExpoOAuthClientInstance,
} from "@/lib/utils/atproto/oauth";
import { isDevMode } from "@/lib/utils/env";
import { Agent } from "@atproto/api";
import type { OAuthSession } from "@atproto/oauth-client";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useEffect, useState } from "react";

export interface OAuthContextValue {
    session?: OAuthSession;
    agent?: Agent;
    client: TypedExpoOAuthClientInstance;
    isLoading: boolean;
}

const OAuthContext = createContext<
    [OAuthContextValue, Dispatch<SetStateAction<OAuthContextValue>>] | null
>(null);

export const useOAuthValue = () => {
    const value = useContext(OAuthContext);
    if (!value)
        throw new Error(
            "OAuth provider failed to initialise. Did you access this out of tree somehow? Tried to access OAuth value before it was initialised.",
        );
    return value[0];
};

export const useOAuthSetter = () => {
    const value = useContext(OAuthContext);
    if (!value)
        throw new Error(
            "OAuth provider failed to initialise. Did you access this out of tree somehow? Tried to access OAuth value before it was initialised.",
        );
    return value[1];
};

export const useOAuthSession = () => {
    const { session } = useOAuthValue();
    return session;
};

export const useOAuthAgent = () => {
    const { agent } = useOAuthValue();
    return agent;
};

export const useOAuthClient = () => {
    const { client } = useOAuthValue();
    return client;
};

export const useOAuthSessionGuaranteed = () => {
    const { session } = useOAuthValue();
    if (!session)
        throw new Error(
            "Tried to access OAuth session before it was created. Ensure that you are calling useOAuthSessionGuaranteed *after* you have a valid OAuth session.",
        );
    return session;
};

export const OAuthProvider = ({ children }: { children: ReactNode }) => {
    const providedOAuthClient = oAuthClient;
    const [oAuth, setOAuth] = useState<OAuthContextValue>({
        client: providedOAuthClient,
        isLoading: true,
    });

    useEffect(() => {
        const initOAuth = async () => {
            try {
                const result = await providedOAuthClient.init();
                if (result) {
                    const { session, state } = result;

                    if (isDevMode) {
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
