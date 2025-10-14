import type { Agent } from "@atproto/api";
import type { OAuthSession } from "@atproto/oauth-client";
import type { ReactNode, Dispatch } from "react";
import { createContext, useContext, useState } from "react";

interface OAuth {
    session?: OAuthSession;
    agent?: Agent;
}

const OAuthContext = createContext<[OAuth, Dispatch<OAuth> | undefined]>([
    { session: undefined, agent: undefined },
    undefined,
]);

export const OAuthProvider = ({ children }: { children: ReactNode }) => {
    const [oAuth, setOAuth] = useState<OAuth>({
        session: undefined,
        agent: undefined,
    });
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
