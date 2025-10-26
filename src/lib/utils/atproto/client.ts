import { Client, simpleFetchHandler } from "@atcute/client";
import type {} from "@atcute/bluesky";

const handler = simpleFetchHandler({ service: "https://public.api.bsky.app" });
export const atprotoClient = new Client({ handler });
