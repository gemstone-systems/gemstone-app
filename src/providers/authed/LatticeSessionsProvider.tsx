import { DEFAULT_STALE_TIME } from "@/lib/consts";
import type { AtUri, Did } from "@/lib/types/atproto";
import type { LatticeSessionInfo } from "@/lib/types/handshake";
import { systemsGmstnDevelopmentChannelRecordSchema } from "@/lib/types/lexicon/systems.gmstn.development.channels";
import { getRecordFromFullAtUri, stringToAtUri } from "@/lib/utils/atproto";
import { useOAuthValue } from "@/providers/OAuthProvider";
import { getMembershipRecordsFromPds } from "@/queries/get-membership-from-pds";
import { initiateHandshakeTo } from "@/queries/initiate-handshake-to";
import type { OAuthSession } from "@atproto/oauth-client";
import { useQueries, useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useMemo } from "react";

type LatticeSessionsMap = Map<Did, LatticeSessionInfo>;

interface LatticeSessionContextValue {
    sessions: LatticeSessionsMap;
    isInitialising: boolean;
    error: Error | null;
    getSession: (latticeDid: Did) => LatticeSessionInfo | undefined;
}

const LatticeSessionsContext = createContext<LatticeSessionContextValue | null>(
    null,
);

export const LatticeSessionsProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const oauth = useOAuthValue();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Explicit guard
    if (!oauth)
        throw new Error(
            "LatticeSessionsProvider must be used within an OAuth provider.",
        );

    const { session, isLoading, agent, client } = oauth;
    const isOAuthReady = !isLoading && !!agent && !!client && !!session;

    const membershipsQuery = useQuery({
        queryKey: ["membership", session?.did],
        enabled: isOAuthReady,
        queryFn: async () => {
            if (!session) throw new Error("We need an OAuth session");
            return await membershipQueryFn(session);
        },
        staleTime: DEFAULT_STALE_TIME,
    });

    // TODO: group channel memberships by

    const channelsQueries = useQueries({
        queries: !membershipsQuery.data
            ? []
            : membershipsQuery.data.map((membershipQueryResult) => ({
                  enabled: membershipsQuery.isSuccess,
                  queryKey: [
                      "channel",
                      membershipQueryResult.membership.channel.uri,
                  ],
                  queryFn: () => channelQueryFn(membershipQueryResult.atUri),
                  staleTime: DEFAULT_STALE_TIME,
              })),
    });

    const handshakeQueries = useQueries({
        queries: channelsQueries
            .map((queryResult) =>
                queryResult.data
                    ? {
                          queryKey: ["handshakes", queryResult.data.name],
                          queryFn: async () => {
                              const { routeThrough } = queryResult.data;
                              const latticeAtUri = stringToAtUri(
                                  routeThrough.uri,
                              );
                              if (!latticeAtUri.ok) {
                                  console.error(
                                      "Lattice AT URI did not resolve properly",
                                      routeThrough,
                                      latticeAtUri.error,
                                  );
                                  throw new Error(
                                      "Something went wrong while initiating handshakes",
                                  );
                              }
                              // TODO: better validation
                              const did = latticeAtUri.data.authority as Did;
                              const handshakeResult = await initiateHandshakeTo(
                                  {
                                      did,
                                      memberships:
                                          membershipsQuery.data?.map(
                                              (queryResult) =>
                                                  queryResult.membership,
                                          ) ?? [],
                                      oauth,
                                  },
                              );

                              if (!handshakeResult.ok) {
                                  console.error(
                                      "Handshake to",
                                      did,
                                      "failed. Reason:",
                                      handshakeResult.error,
                                  );
                                  throw new Error("Handshake failed.");
                              }

                              return {
                                  did,
                                  sessionInfo: handshakeResult.data,
                              };
                          },
                          staleTime: DEFAULT_STALE_TIME,
                      }
                    : undefined,
            )
            .filter((query) => query !== undefined),
    });

    const isInitialising =
        membershipsQuery.isLoading ||
        channelsQueries.some((q) => q.isLoading) ||
        handshakeQueries.some((q) => q.isLoading);

    const error =
        membershipsQuery.error ??
        channelsQueries.find((q) => q.error)?.error ??
        handshakeQueries.find((q) => q.error)?.error ??
        null;

    const sessions = useMemo(() => {
        const sessionsMap = new Map<Did, LatticeSessionInfo>();
        handshakeQueries.forEach((queryResult) => {
            if (queryResult.data) {
                const { did, sessionInfo } = queryResult.data;
                sessionsMap.set(did, sessionInfo);
            }
        });
        return sessionsMap;
    }, [handshakeQueries]);

    const value: LatticeSessionContextValue = {
        isInitialising,
        error,
        sessions,
        getSession: (latticeDid) => sessions.get(latticeDid),
    };

    return (
        <LatticeSessionsContext value={value}>
            {children}
        </LatticeSessionsContext>
    );
};

const membershipQueryFn = async (session: OAuthSession) => {
    const memberships = await getMembershipRecordsFromPds({
        pdsEndpoint: session.serverMetadata.issuer,
        did: session.did,
    });

    if (!memberships.ok) {
        console.error("getMembershipRecordsFromPds error.", memberships.error);
        throw new Error(
            `Something went wrong while getting the user's membership records.}`,
        );
    }
    const { data } = memberships;
    const membershipAtUris = data.map((membership) => {
        const convertResult = stringToAtUri(membership.channel.uri);
        if (!convertResult.ok) {
            console.error(
                "Could not convert",
                membership,
                "into at:// URI object.",
                convertResult.error,
            );
            return;
        }
        return { membership, atUri: convertResult.data };
    });

    return membershipAtUris.filter((membership) => membership !== undefined);
};

// FIXME: holy shit don't do this. we will build prism and use that to resolve
// our memberships into channels. for now we resolve the at-uri manually.
const channelQueryFn = async (membership: AtUri) => {
    const res = await getRecordFromFullAtUri(membership);
    if (!res.ok) {
        console.error("Could not retrieve record from full at uri", res.error);
        throw new Error("Something went wrong while fetching channel records");
    }
    const {
        success,
        error,
        data: channel,
    } = systemsGmstnDevelopmentChannelRecordSchema.safeParse(res.data);
    if (!success) {
        console.error(
            res.data,
            "did not resolve to a valid channel record",
            error,
        );
        throw new Error("Something went wrong while fetching channel records");
    }
    return channel;
};
