import type { AtUri } from "@/lib/types/atproto";
import { stringToAtUri } from "@/lib/utils/atproto";
import { getUserLattices } from "@/queries/get-lattices-from-pds";
import type { OAuthSession } from "@atproto/oauth-client";
import { useQuery } from "@tanstack/react-query";

export const useLatticesQuery = (session: OAuthSession) => {
    const queryKey = ["lattices", session.did];
    return {
        queryKey,
        useQuery: () =>
            useQuery({
                queryKey: queryKey,
                queryFn: async () => {
                    return await latticeQueryFn(session);
                },
            }),
    };
};

const latticeQueryFn = async (session: OAuthSession) => {
    const lattices = await getUserLattices({
        pdsEndpoint: session.serverMetadata.issuer,
        did: session.did,
    });

    if (!lattices.ok) {
        console.error("latticeQueryFn error.", lattices.error);
        throw new Error(
            `Something went wrong while getting the user's lattice records.}`,
        );
    }

    const results = lattices.data
        .map((record) => {
            const convertResult = stringToAtUri(record.uri);
            if (!convertResult.ok) {
                console.error(
                    "Could not convert",
                    record,
                    "into at:// URI object.",
                    convertResult.error,
                );
                return;
            }
            if (!convertResult.data.collection || !convertResult.data.rKey) {
                console.error(
                    record,
                    "did not convert to a full at:// URI with collection and rkey.",
                );
                return;
            }
            const uri: Required<AtUri> = {
                authority: convertResult.data.authority,
                collection: convertResult.data.collection,
                rKey: convertResult.data.rKey,
            };
            return {
                cid: record.cid,
                uriStr: record.uri,
                uri,
                value: record.value,
            };
        })
        .filter((atUri) => atUri !== undefined);

    return results;
};
