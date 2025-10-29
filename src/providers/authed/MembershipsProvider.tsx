import { DEFAULT_STALE_TIME } from "@/lib/consts";
import type { AtUri } from "@/lib/types/atproto";
import type { SystemsGmstnDevelopmentChannelMembership } from "@/lib/types/lexicon/systems.gmstn.development.channel.membership";
import { stringToAtUri } from "@/lib/utils/atproto";
import { useOAuthValue } from "@/providers/OAuthProvider";
import { getMembershipRecordsFromPds } from "@/queries/get-membership-from-pds";
import type { OAuthSession } from "@atproto/oauth-client";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

interface MembershipsContextValue {
    memberships: Array<{
        membership: SystemsGmstnDevelopmentChannelMembership;
        channelAtUri: AtUri;
    }>;
    isInitialising: boolean;
    error: Error | null;
}

const MembershipsContext = createContext<MembershipsContextValue | null>(null);

export const useMemberships = () => {
    const membershipsValue = useContext(MembershipsContext);
    if (!membershipsValue)
        throw new Error(
            "Memberships context was null. Did you try to access this outside of the authed providers? MembershipsProvider must be below OAuthProvider.",
        );
    return membershipsValue;
};

export const useMembershipByAtUriObject = (atUri: AtUri) => {
    const { memberships } = useMemberships();
    return memberships.find((membership) => membership.channelAtUri === atUri);
};

export const useMembershipByAtUriString = (atUriString: string) => {
    const convertResult = stringToAtUri(atUriString);
    const { memberships } = useMemberships();
    if (!convertResult.ok) {
        console.error(
            "Something went wrong getting membership value from context.",
        );
        console.error(
            "Provided string",
            atUriString,
            "was not a valid at:// URI",
        );
        return;
    }
    const { data: atUri } = convertResult;
    return memberships.find((membership) => membership.channelAtUri === atUri);
};

export const useMembershipByInviteCid = (inviteCid: string) => {
    const { memberships } = useMemberships();
    return memberships.find(
        ({ membership }) => (membership.invite.cid = inviteCid),
    );
};

export const useMembershipByInviteAtUriString = (inviteAtUriString: string) => {
    const { memberships } = useMemberships();
    return memberships.find(
        ({ membership }) => (membership.invite.uri = inviteAtUriString),
    );
};

export const useMembershipByChannelCid = (channelCid: string) => {
    const { memberships } = useMemberships();
    return memberships.find(
        ({ membership }) => membership.channel.cid === channelCid,
    );
};

export const useMembershipByChannetAtUriString = (
    channelAtUriString: string,
) => {
    const { memberships } = useMemberships();
    return memberships.find(
        ({ membership }) => membership.channel.uri === channelAtUriString,
    );
};

export const MembershipsProvider = ({ children }: { children: ReactNode }) => {
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
    const isInitialising = membershipsQuery.isLoading;

    const value: MembershipsContextValue = {
        isInitialising,
        memberships: membershipsQuery.data ?? [],
        error: membershipsQuery.error,
    };

    return <MembershipsContext value={value}>{children}</MembershipsContext>;
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
        return { membership, channelAtUri: convertResult.data };
    });

    return membershipAtUris.filter((membership) => membership !== undefined);
};
