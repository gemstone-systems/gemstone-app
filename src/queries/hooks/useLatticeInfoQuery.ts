import { getOwnerInfoFromLattice } from "@/queries/get-owner-info-from-lattice";
import { useQuery } from "@tanstack/react-query";

export const useLatticeInfoQuery = (latticeDomain: string) => {
    const queryKey = ["latticeInfo", latticeDomain];
    return {
        queryKey,
        useQuery: () =>
            useQuery({
                queryKey,
                queryFn: async () => {
                    return await getOwnerInfoFromLattice(latticeDomain);
                },
                retry: 1,
            }),
    };
};
