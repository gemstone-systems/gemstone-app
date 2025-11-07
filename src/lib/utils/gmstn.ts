import type { Did } from "@/lib/types/atproto";
import type { SystemsGmstnDevelopmentShard } from "@/lib/types/lexicon/systems.gmstn.development.shard";
import { getEndpointFromDid } from "@/lib/utils/atproto";
import { isDomain } from "@/lib/utils/domains";
import type { Result } from "@/lib/utils/result";
import type { Agent } from "@atproto/api";

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
            error: "Attempted to create shard record failed. Check the domain inputs.",
        };

    return { ok: true };
};
export const registerNewLattice = async ({
    latticeDomain: latticeDomain,
    agent,
}: {
    latticeDomain: string;
    agent: Agent;
}): Promise<Result<undefined, string>> => {
    if (!isDomain(latticeDomain))
        return { ok: false, error: "Input was not a valid domain." };

    const now = new Date().toISOString();

    const record: Omit<SystemsGmstnDevelopmentShard, "$type"> = {
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
            error: "Attempted to create lattice record failed. Check the domain inputs.",
        };

    return { ok: true };
};
