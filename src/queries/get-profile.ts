import type { DidPlc } from "@/lib/types/atproto";
import { client } from "@/lib/utils/atproto/client";

export const getBskyProfile = async (did: DidPlc) => {
    const { ok, data } = await client.get("app.bsky.actor.getProfile", {
        params: {
            actor: did,
        },
    });

    if (!ok) {
        switch (data.error) {
            case "InvalidRequest": {
                console.error("There is no account at", did);
                return;
            }
            case "AccountTakedown": {
                console.error("Account of", did, "was taken down");
                return;
            }
            case "AccountDeactivated": {
                console.error("Account of", did, "was deactivated");
                return;
            }
            default: {
                console.error(
                    "Something went wrong fetching the profile of",
                    did,
                );
                return;
            }
        }
    }

    return data;
};
