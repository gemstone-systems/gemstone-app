import type { AtUri } from "@/lib/types/atproto";
import { stringToAtUri } from "@/lib/utils/atproto";
import { getChannelRecordsFromPds } from "@/queries/get-channels-from-pds";
import type { OAuthSession } from "@atproto/oauth-client";
import { useQuery } from "@tanstack/react-query";

export const useChannelsQuery = (session: OAuthSession) => {
    const queryKey = ["channels", session.did];
    return {
        queryKey,
        useQuery: () =>
            useQuery({
                queryKey,
                queryFn: async () => {
                    return await channelsQueryFn(session);
                },
            }),
    };
};

const channelsQueryFn = async (session: OAuthSession) => {
    const channels = await getChannelRecordsFromPds({
        pdsEndpoint: session.serverMetadata.issuer,
        did: session.did,
    });

    if (!channels.ok) {
        console.error("channelsQueryFn error.", channels.error);
        throw new Error(
            `Something went wrong while getting the user's channel records.}`,
        );
    }

    const results = channels.data
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
            return { cid: record.cid, uri, value: record.value };
        })
        .filter((atUri) => atUri !== undefined);

    return results;
};
