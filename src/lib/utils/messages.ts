import type { Did } from "@/lib/types/atproto";
import type { ShardMessage } from "@/lib/types/messages";

export const sendShardMessage = (
    {
        content,
        channel,
        sentBy,
        routedThrough,
    }: {
        content: string;
        channel: string;
        sentBy: Did;
        routedThrough: Did;
    },
    latticeSocket: WebSocket,
) => {
    const message: ShardMessage = {
        type: "shard/message",

        content,
        channel,
        sentBy,
        routedThrough,
        sentAt: new Date(),
    };
    if (latticeSocket.readyState === WebSocket.OPEN)
        latticeSocket.send(JSON.stringify(message));
};
