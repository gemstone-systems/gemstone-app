import type { Did, DidPlc, DidWeb } from "@/lib/types/atproto";
import { bskyClient } from "@/lib/utils/atproto/client";

export const getBskyProfile = async (did: Did) => {
    const { ok, data } = await bskyClient.get("app.bsky.actor.getProfile", {
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
