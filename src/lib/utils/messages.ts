import type { Did } from "@/lib/types/atproto";
import type { ShardMessage } from "@/lib/types/messages";

export const sendShardMessage = (
    {
        sessionToken,
        content,
        channel,
        sentBy,
    }: {
        sessionToken: string;
        content: string;
        channel: string;
        sentBy: Did;
    },
    latticeSocket: WebSocket,
) => {
    const message: ShardMessage = {
        type: "shard/message",
        sessionToken,
        content,
        channel,
        sentBy,
        sentAt: new Date(),
    };
    if (latticeSocket.readyState === WebSocket.OPEN)
        latticeSocket.send(JSON.stringify(message));
};
