import { getInvitesFromConstellation } from "@/queries/get-invites-from-constellation";
import type { OAuthSession } from "@atproto/oauth-client";
import { useQuery } from "@tanstack/react-query";

export const useConstellationInvitesQuery = (session: OAuthSession) => {
    const queryKey = ["invites", session.did];
    return {
        queryKey,
        useQuery: () =>
            useQuery({
                queryKey,
                queryFn: async () => {
                    return await invitesQueryFn(session);
                },
            }),
    };
};

const invitesQueryFn = async (session: OAuthSession) => {
    const invites = await getInvitesFromConstellation(session.did);

    if (!invites.ok) {
        console.error("invitesQueryFn error.", invites.error);
        throw new Error(
            `Something went wrong while getting the user's invite records.}`,
        );
    }

    return invites.data;
};
