import type { AtUri, Did } from "@/lib/types/atproto";
import type { LatticeSessionInfo } from "@/lib/types/handshake";
import type { SystemsGmstnDevelopmentChannelMembership } from "@/lib/types/lexicon/systems.gmstn.development.channel.membership";
import type { SystemsGmstnDevelopmentChannel } from "@/lib/types/lexicon/systems.gmstn.development.channel";
import { stringToAtUri } from "@/lib/utils/atproto";
import {
    ChannelsProvider,
    useChannelRecords,
} from "@/providers/authed/ChannelsProvider";
import {
    MembershipsProvider,
    useMemberships,
} from "@/providers/authed/MembershipsProvider";
import type { OAuthContextValue } from "@/providers/OAuthProvider";
import { useOAuthValue } from "@/providers/OAuthProvider";
import { initiateHandshakeTo } from "@/queries/initiate-handshake-to";
import { useQueries } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";

type HandshakesMap = Map<AtUri, LatticeSessionInfo>;

interface HandshakeContextValue {
    handshakesMap: HandshakesMap;
    isInitialising: boolean;
    error: Error | null;
    getHandshake: (latticeDid: AtUri) => LatticeSessionInfo | undefined;
}

const HandshakesContext = createContext<HandshakeContextValue | null>(null);

export const useHandshakes = () => {
    const handshakesValue = useContext(HandshakesContext);
    if (!handshakesValue)
        throw new Error(
            "Handshakes context was null. Did you try to access this outside of the authed providers? HandshakesProvider(Inner) must be below ChannelsProvider.",
        );
    return handshakesValue;
};

const HandshakesProviderInner = ({ children }: { children: ReactNode }) => {
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

    const {
        session: oAuthSession,
        isLoading: isOauthLoading,
        agent: oAuthAgent,
    } = oauth;
    const isOAuthReady = !isOauthLoading && !!oAuthAgent && !!oAuthSession;

    const handshakeQueries = useQueries({
        queries: channels.map((channelObj) => ({
            enabled: !channelsInitialising && !membershipsInitialising,
            queryKey: ["handshakes", channelObj.channel.name],
            queryFn: () =>
                handshakesQueryFn({
                    channel: channelObj.channel,
                    memberships: memberships.map(
                        ({ membership }) => membership,
                    ),
                    oauth,
                }),
            staleTime: Infinity,
        })),
    });

    const isInitialising =
        !isOAuthReady ||
        membershipsInitialising ||
        channelsInitialising ||
        handshakeQueries.some((q) => q.isLoading);

    const error =
        membershipError ??
        channelsError ??
        handshakeQueries.find((q) => q.error)?.error ??
        null;

    const handshakes = useMemo(() => {
        const handshakesMap = new Map<AtUri, LatticeSessionInfo>();
        handshakeQueries.forEach((queryResult) => {
            if (queryResult.data) {
                const { latticeAtUri, sessionInfo } = queryResult.data;
                handshakesMap.set(latticeAtUri, sessionInfo);
            }
        });
        return handshakesMap;
    }, [handshakeQueries]);

    const value: HandshakeContextValue = {
        isInitialising,
        error,
        handshakesMap: handshakes,
        getHandshake: (latticeDid) => handshakes.get(latticeDid),
    };

    return <HandshakesContext value={value}>{children}</HandshakesContext>;
};

const handshakesQueryFn = async ({
    channel,
    memberships,
    oauth,
}: {
    channel: SystemsGmstnDevelopmentChannel;
    memberships: Array<SystemsGmstnDevelopmentChannelMembership>;
    oauth: OAuthContextValue;
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
        latticeAtUri: latticeAtUri.data,
        sessionInfo: handshakeResult.data,
    };
};

export const HandshakesProvider = ({ children }: { children: ReactNode }) => {
    // Memberships must be above channels
    // channels must be above lattice sessions inner
    // do it this way to preserve the order if we need to move them around some day
    return (
        <MembershipsProvider>
            <ChannelsProvider>
                <HandshakesProviderInner>{children}</HandshakesProviderInner>
            </ChannelsProvider>
        </MembershipsProvider>
    );
};
