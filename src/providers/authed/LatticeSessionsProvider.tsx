import { DEFAULT_STALE_TIME } from "@/lib/consts";
import type { Did } from "@/lib/types/atproto";
import type { LatticeSessionInfo } from "@/lib/types/handshake";
import type { SystemsGmstnDevelopmentChannelMembership } from "@/lib/types/lexicon/systems.gmstn.development.channel.membership";
import type { SystemsGmstnDevelopmentChannel } from "@/lib/types/lexicon/systems.gmstn.development.channels";
import { stringToAtUri } from "@/lib/utils/atproto";
import {
    ChannelsProvider,
    useChannelRecords,
} from "@/providers/authed/ChannelsProvider";
import {
    MembershipsProvider,
    useMemberships,
} from "@/providers/authed/MembershipsProvider";
import type { OAuth } from "@/providers/OAuthProvider";
import { useOAuthValue } from "@/providers/OAuthProvider";
import { initiateHandshakeTo } from "@/queries/initiate-handshake-to";
import { useQueries } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";

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

export const useLatticeSession = () => {
    const value = useContext(LatticeSessionsContext);
    if (value === null)
        throw new Error(
            "Lattice session context not inited. Or ordering of providers was wrong.",
        );
    return value.sessions;
};

const LatticeSessionsProviderInner = ({
    children,
}: {
    children: ReactNode;
}) => {
    const {
        memberships,
        isInitialising: membershipsInitialising,
        error: membershipError,
    } = useMemberships();
    const {
        channels,
        isInitialising: channelsInitialising,
        error: channelsError,
    } = useChannelRecords();
    const oauth = useOAuthValue();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Explicit guard
    if (!oauth)
        throw new Error(
            "LatticeSessionsProvider must be used within an OAuth provider.",
        );

    const { session, isLoading, agent, client } = oauth;
    const isOAuthReady = !isLoading && !!agent && !!client && !!session;

    const handshakeQueries = useQueries({
        queries: channels.map((channelObj) => ({
            queryKey: ["handshakes", channelObj.channel.name],
            queryFn: () =>
                handshakesQueryFn({
                    channel: channelObj.channel,
                    memberships: memberships.map(
                        ({ membership }) => membership,
                    ),
                    oauth,
                }),
            staleTime: DEFAULT_STALE_TIME,
        })),
    });

    const isInitialising =
        isOAuthReady ||
        membershipsInitialising ||
        channelsInitialising ||
        handshakeQueries.some((q) => q.isLoading);

    const error =
        membershipError ??
        channelsError ??
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

const handshakesQueryFn = async ({
    channel,
    memberships,
    oauth,
}: {
    channel: SystemsGmstnDevelopmentChannel;
    memberships: Array<SystemsGmstnDevelopmentChannelMembership>;
    oauth: OAuth;
}) => {
    const { routeThrough } = channel;
    const latticeAtUri = stringToAtUri(routeThrough.uri);
    if (!latticeAtUri.ok) {
        console.error(
            "Lattice AT URI did not resolve properly",
            routeThrough,
            latticeAtUri.error,
        );
        throw new Error("Something went wrong while initiating handshakes");
    }
    // TODO: unfuck this.
    const did =
        `did:web:${encodeURIComponent(latticeAtUri.data.rKey ?? "")}` as Did;
    const handshakeResult = await initiateHandshakeTo({
        did,
        memberships,
        oauth,
    });

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
};

export const LatticeSessionsProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    // Memberships must be above channels
    // channels must be above lattice sessions inner
    // do it this way to preserve the order if we need to move them around some day
    return (
        <MembershipsProvider>
            <ChannelsProvider>
                <LatticeSessionsProviderInner>
                    {children}
                </LatticeSessionsProviderInner>
            </ChannelsProvider>
        </MembershipsProvider>
    );
};
