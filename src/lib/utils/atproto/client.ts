import { Client, simpleFetchHandler } from "@atcute/client";
import type {} from "@atcute/bluesky";
import type {} from "@atcute/atproto";

const handler = simpleFetchHandler({ service: "https://public.api.bsky.app" });
export const bskyClient = new Client({ handler });
