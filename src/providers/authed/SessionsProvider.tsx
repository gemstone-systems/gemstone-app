import { DEFAULT_STALE_TIME } from "@/lib/consts";
import type { AtUri } from "@/lib/types/atproto";
import type { LatticeSessionInfo } from "@/lib/types/handshake";
import { isDomain } from "@/lib/utils/domains";
import { connectToLattice, getLatticeEndpointFromDid } from "@/lib/utils/gmstn";
import { useHandshakes } from "@/providers/authed/HandshakesProvider";
import { useQueries } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

type SessionsMap = Map<LatticeSessionInfo, WebSocket>;

interface SessionsContextValue {
    sessionsMap: SessionsMap;
    isInitialising: boolean;
    error: Error | null;
    getSession: (sessionInfo: LatticeSessionInfo) => WebSocket | undefined;
    findChannelSession: (channel: AtUri) => {
        sessionInfo: LatticeSessionInfo | undefined;
        socket: WebSocket | undefined;
    };
}

const SessionsContext = createContext<SessionsContextValue | null>(null);

export const useSessions = () => {
    const sessionsValue = useContext(SessionsContext);
    if (!sessionsValue)
        throw new Error(
            "Sessions context was null. Did you try to access this outside of the authed providers? SessionsProvider must be below HandshakesProvider.",
        );
    return sessionsValue;
};

// TODO: remove this. temp testing function
export const useFirstSessionWsTemp = () => {
    const wss = useSessions().sessionsMap.values().toArray();
    if (wss.length === 0) return;
    return wss[0];
};

export const SessionsProvider = ({ children }: { children: ReactNode }) => {
    const { handshakesMap, isInitialising: handshakesInitialising } =
        useHandshakes();
    const handshakes = handshakesMap.entries().toArray();

    const endpointQueries = useQueries({
        queries: handshakes.map((handshake) => ({
            enabled: !handshakesInitialising,
            queryKey: ["lattice-endpoints", handshake[0].rKey],
            queryFn: async () => {
                return await endpointQueryFn(handshake);
            },
            staleTime: DEFAULT_STALE_TIME,
        })),
    });

    console.log(endpointQueries);

    const isInitialising =
        handshakesInitialising || endpointQueries.some((q) => q.isLoading);
    const error = endpointQueries.find((q) => q.error)?.error ?? null;

    const sessionsMap = new Map<LatticeSessionInfo, WebSocket>();

    endpointQueries.forEach((q) => {
        const endpoint = q.data;
        if (!endpoint) return;
        const { sessionInfo, shardUrl } = endpoint;
        const websocket = connectToLattice({
            shardUrl,
            sessionToken: sessionInfo.token,
        });
        sessionsMap.set(sessionInfo, websocket);
    });

    const value: SessionsContextValue = {
        sessionsMap,
        isInitialising,
        error,
        getSession: (sessionInfo: LatticeSessionInfo) =>
            sessionsMap.get(sessionInfo),
        findChannelSession: (channel: AtUri) => {
            console.log("sessionsMap", sessionsMap);
            const sessionInfo = sessionsMap.keys().find((sessionInfo) => {
                const foundInfo = sessionInfo.allowedChannels.some(
                    (allowedChannel) => allowedChannel.rKey === channel.rKey,
                );
                if (!foundInfo) return;
                return sessionInfo;
            });

            console.log("tried to find", channel);
            if (!sessionInfo)
                throw new Error(
                    "Provided channel at:// URI (object) could not be found in any existing lattice sessions",
                );

            return { sessionInfo, socket: sessionsMap.get(sessionInfo) };
        },
    };

    return <SessionsContext value={value}>{children}</SessionsContext>;
};

const endpointQueryFn = async (handshake: [AtUri, LatticeSessionInfo]) => {
    const atUri = handshake[0];
    const sessionInfo = handshake[1];
    const rkey = atUri.rKey ?? "";
    const shardDid = isDomain(rkey)
        ? `did:web:${encodeURIComponent(rkey)}`
        : `did:plc:${rkey}`;

    // TODO: again, implement proper did -> endpoint parsing here too.
    // for now, we just assume did:web and construce a URL based on that.
    // @ts-expect-error trust me bro it's a string
    const shardUrlResult = await getLatticeEndpointFromDid(shardDid);

    if (!shardUrlResult.ok) return;

    return {
        // TODO: xrpc and lexicon this endpoint
        shardUrl: `${shardUrlResult.data.origin}/connect`,
        sessionInfo,
    };
};
