import type { Did } from "@/lib/types/atproto";
import { getEndpointFromDid } from "@/lib/utils/atproto";

export const getLatticeEndpointFromDid = async (did: Did) => {
    return await getEndpointFromDid(did, "GemstoneLattice");
};

export const connectToLattice = ({
    shardUrl,
    sessionToken,
}: {
    shardUrl: string;
    sessionToken: string;
}) => {
    const endpoint = new URL(shardUrl);
    endpoint.searchParams.append("token", sessionToken);
    return new WebSocket(endpoint);
};
