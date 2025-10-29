import { DEFAULT_STALE_TIME } from "@/lib/consts";
import type { AtUri } from "@/lib/types/atproto";
import {
    systemsGmstnDevelopmentChannelRecordSchema,
    type SystemsGmstnDevelopmentChannel,
} from "@/lib/types/lexicon/systems.gmstn.development.channels";
import { getRecordFromFullAtUri, stringToAtUri } from "@/lib/utils/atproto";
import { useMemberships } from "@/providers/authed/MembershipsProvider";
import { useQueries } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

interface ChannelsContextValue {
    channels: Array<{
        channel: SystemsGmstnDevelopmentChannel;
        channelAtUri: AtUri;
    }>;
    isInitialising: boolean;
    error: Error | null;
}

const ChannelsContext = createContext<ChannelsContextValue | null>(null);

export const useChannelRecords = () => {
    const channelsValue = useContext(ChannelsContext);
    if (!channelsValue)
        throw new Error(
            "Channels context was null. Did you try to access this outside of the authed providers? ChannelsProvider must be below MembershipsProvider.",
        );
    return channelsValue;
};

export const useChannelRecordByAtUriObject = (channelAtUri: AtUri) => {
    const { channels } = useChannelRecords();
    return channels.find((channel) => channel.channelAtUri === channelAtUri);
};

export const useChannelRecordByAtUriString = (channelAtUriString: string) => {
    const convertResult = stringToAtUri(channelAtUriString);
    const { channels } = useChannelRecords();
    if (!convertResult.ok) {
        console.error(
            "Something went wrong getting membership value from context.",
        );
        console.error(
            "Provided string",
            channelAtUriString,
            "was not a valid at:// URI",
        );
        return;
    }
    const { data: atUri } = convertResult;
    return channels.find((channel) => channel.channelAtUri === atUri);
};

export const ChannelsProvider = ({ children }: { children: ReactNode }) => {
    const { memberships, isInitialising: membershipsInitialising } =
        useMemberships();

    // TODO: group channel memberships by

    const channelsQueries = useQueries({
        queries: memberships.map((membershipObjects) => ({
            enabled: !membershipsInitialising,
            queryKey: ["channel", membershipObjects.membership.channel.uri],
            queryFn: () => channelQueryFn(membershipObjects.channelAtUri),
            staleTime: DEFAULT_STALE_TIME,
        })),
    });

    const isInitialising = channelsQueries.some((q) => q.isLoading);

    const value: ChannelsContextValue = {
        isInitialising,
        channels: channelsQueries
            .map((q) => q.data)
            .filter((c) => c !== undefined),
        error: channelsQueries.find((q) => q.error)?.error ?? null,
    };

    return <ChannelsContext value={value}>{children}</ChannelsContext>;
};

// FIXME: holy shit don't do this. we will build prism and use that to resolve
// our memberships into channels. for now we resolve the at-uri manually.
const channelQueryFn = async (channelAtUri: AtUri) => {
    const res = await getRecordFromFullAtUri(channelAtUri);
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
    return { channel, channelAtUri };
};
