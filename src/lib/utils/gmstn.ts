import type { ComAtprotoRepoStrongRef, Did } from "@/lib/types/atproto";
import type { SystemsGmstnDevelopmentShard } from "@/lib/types/lexicon/systems.gmstn.development.shard";
import { getEndpointFromDid } from "@/lib/utils/atproto";
import { isDomain } from "@/lib/utils/domains";
import type { Result } from "@/lib/utils/result";
import type { Agent } from "@atproto/api";
import * as TID from "@atcute/tid";
import type { SystemsGmstnDevelopmentLattice } from "@/lib/types/lexicon/systems.gmstn.development.lattice";
import type { SystemsGmstnDevelopmentChannelInvite } from "@/lib/types/lexicon/systems.gmstn.development.channel.invite";
import type { SystemsGmstnDevelopmentChannel } from "@/lib/types/lexicon/systems.gmstn.development.channel";
import type { SystemsGmstnDevelopmentChannelMembership } from "@/lib/types/lexicon/systems.gmstn.development.channel.membership";

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

export const registerNewShard = async ({
    shardDomain,
    agent,
}: {
    shardDomain: string;
    agent: Agent;
}): Promise<Result<undefined, string>> => {
    if (!isDomain(shardDomain))
        return { ok: false, error: "Input was not a valid domain." };

    const now = new Date().toISOString();

    const record: Omit<SystemsGmstnDevelopmentShard, "$type"> = {
        // @ts-expect-error we want to explicitly use the ISO string variant
        createdAt: now,
        // TODO: actually figure out how to support the description
        description: "A Gemstone Systems Shard.",
    };
    console.log(record);

    const { success } = await agent.call(
        "com.atproto.repo.createRecord",
        {},
        {
            repo: agent.did,
            collection: "systems.gmstn.development.shard",
            rkey: shardDomain,
            record,
        },
    );

    if (!success)
        return {
            ok: false,
            error: "Attempt to create shard record failed. Check the domain inputs.",
        };

    return { ok: true };
};

export const registerNewLattice = async ({
    latticeDomain,
    agent,
}: {
    latticeDomain: string;
    agent: Agent;
}): Promise<Result<undefined, string>> => {
    if (!isDomain(latticeDomain))
        return { ok: false, error: "Input was not a valid domain." };

    const now = new Date().toISOString();

    const record: Omit<SystemsGmstnDevelopmentLattice, "$type"> = {
        // @ts-expect-error we want to explicitly use the ISO string variant
        createdAt: now,
        // TODO: actually figure out how to support the description
        description: "A Gemstone Systems Lattice.",
    };
    console.log(record);

    const { success } = await agent.call(
        "com.atproto.repo.createRecord",
        {},
        {
            repo: agent.did,
            collection: "systems.gmstn.development.lattice",
            rkey: latticeDomain,
            record,
        },
    );

    if (!success)
        return {
            ok: false,
            error: "Attempt to create lattice record failed. Check the domain inputs.",
        };

    return { ok: true };
};

export const inviteNewUser = async ({
    did,
    channel,
    agent,
}: {
    did: Did;
    channel: ComAtprotoRepoStrongRef;
    agent: Agent;
}): Promise<Result<undefined, string>> => {
    const now = new Date();
    const rkey = TID.create(now.getTime() * 1_000, Math.random());

    const record: Omit<SystemsGmstnDevelopmentChannelInvite, "$type"> = {
        // @ts-expect-error we want to explicitly use the ISO string variant
        createdAt: now.toISOString(),
        recipient: did,
        channel,
    };

    const { success } = await agent.call(
        "com.atproto.repo.createRecord",
        {},
        {
            repo: agent.did,
            collection: "systems.gmstn.development.channel.invite",
            rkey,
            record,
        },
    );

    if (!success)
        return {
            ok: false,
            error: "Attempt to create invite record failed. Check the did and strongRef inputs.",
        };

    return { ok: true };
};

export const addChannel = async ({
    channelInfo,
    agent,
}: {
    channelInfo: Omit<SystemsGmstnDevelopmentChannel, "$type" | "createdAt">;
    agent: Agent;
}): Promise<Result<undefined, string>> => {
    const now = new Date();
    const rkey = TID.create(now.getTime() * 1_000, Math.floor(Math.random() * 1023));

    const record: Omit<SystemsGmstnDevelopmentChannel, "$type"> = {
        // @ts-expect-error we want to explicitly use the ISO string variant
        createdAt: now.toISOString(),
        ...channelInfo,
    };

    const { success } = await agent.call(
        "com.atproto.repo.createRecord",
        {},
        {
            repo: agent.did,
            collection: "systems.gmstn.development.channel",
            rkey,
            record,
        },
    );

    if (!success)
        return {
            ok: false,
            error: "Attempted to create channel record failed. Check the channel info inputs.",
        };

    return { ok: true };
};

export const addMembership = async ({
    membershipInfo,
    agent,
}: {
    membershipInfo: Omit<
        SystemsGmstnDevelopmentChannelMembership,
        "$type" | "createdAt" | "updatedAt"
    >;
    agent: Agent;
}): Promise<Result<undefined, string>> => {
    const now = new Date();
    const rkey = TID.create(now.getTime() * 1_000, Math.floor(Math.random() * 1023));

    const record: Omit<SystemsGmstnDevelopmentChannelMembership, "$type"> = {
        // @ts-expect-error we want to explicitly use the ISO string variant
        createdAt: now.toISOString(),
        // @ts-expect-error we want to explicitly use the ISO string variant
        updatedAt: now.toISOString(),
        ...membershipInfo,
    };

    const { success } = await agent.call(
        "com.atproto.repo.createRecord",
        {},
        {
            repo: agent.did,
            collection: "systems.gmstn.development.channel.membership",
            rkey,
            record,
        },
    );

    if (!success)
        return {
            ok: false,
            error: "Attempted to create channel record failed. Check the channel info inputs.",
        };

    return { ok: true };
};
