import type { AtUri } from "@/lib/types/atproto";
import { getInviteFromPds } from "@/queries/get-invite-from-pds";
import { useQuery } from "@tanstack/react-query";

export const useInviteQuery = (atUri: Required<AtUri>) => {
    const queryKey = ["invite", atUri.authority, atUri.rKey];
    return {
        queryKey,
        useQuery: () =>
            useQuery({
                queryKey,
                queryFn: async () => {
                    return await pdsInviteQueryFn(atUri);
                },
            }),
    };
};

const pdsInviteQueryFn = async (atUri: Required<AtUri>) => {
    const invites = await getInviteFromPds(atUri);

    if (!invites.ok) {
        console.error("pdsInviteQueryFn error.", invites.error);
        throw new Error(
            `Something went wrong while getting the user's invite record directly.}`,
        );
    }

    return invites.data;
};
