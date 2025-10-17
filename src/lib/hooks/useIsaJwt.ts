import { useOAuthAgent, useOAuthSession } from "@/providers/OAuthProvider";
import type { Agent } from "@atproto/api";
import type { OAuthSession } from "@atproto/oauth-client";
import { useQuery } from "@tanstack/react-query";

export const useIsaJwt = () => {
    const agent = useOAuthAgent();
    const session = useOAuthSession();
    const { data, error, isPending } = useQuery({
        queryKey: ["isa-jwt"],
        queryFn: async () => {
            return await requestIsaJwt({ agent, session });
        },
    });
    if (error)
        throw new Error(
            `something went wrong when trying to request the inter-service JWT ${JSON.stringify(error)}`,
        );
    return { data, isPending };
};

const requestIsaJwt = async ({
    agent,
    session,
}: {
    agent: Agent | undefined;
    session: OAuthSession | undefined;
}) => {
    if (!agent || !session) return;
    const { data, success } = await agent.com.atproto.server.getServiceAuth({
        aud: session.did,
    });
    if (!success)
        throw new Error(
            `something went wrong calling com.atproto.server.getServiceAuth with did ${session.did}`,
        );
    return { token: data.token };
};
