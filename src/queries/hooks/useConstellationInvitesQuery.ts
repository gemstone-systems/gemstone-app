import { getInvitesFromConstellation } from "@/queries/get-invites-from-constellation";
import type { OAuthSession } from "@atproto/oauth-client";
import { useQuery } from "@tanstack/react-query";

// TODO: use prism instead, so that we can get the backlink, the invite, and the channel's actual record
// and not just the strongRef.
export const useConstellationInvitesQuery = (session: OAuthSession) => {
    const queryKey = ["invites", session.did];
    return {
        queryKey,
        useQuery: () =>
            useQuery({
                queryKey,
                queryFn: async () => {
                    return await constellationInvitesQueryFn(session);
                },
            }),
    };
};

const constellationInvitesQueryFn = async (session: OAuthSession) => {
    const invites = await getInvitesFromConstellation(session.did);

    if (!invites.ok) {
        console.error("constellationInvitesQueryFn error.", invites.error);
        throw new Error(
            `Something went wrong while getting the user's invite records.}`,
        );
    }

    return invites.data;
};
