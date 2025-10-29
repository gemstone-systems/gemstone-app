import type { Did } from "@/lib/types/atproto";
import type { ShardMessage } from "@/lib/types/messages";
import type { Dispatch, SetStateAction } from "react";

export const sendShardMessage = (
    {
        content,
        channel,
        sentBy,
    }: {
        content: string;
        channel: string;
        sentBy: Did;
    },
    latticeSocket: WebSocket,
) => {
    const message: ShardMessage = {
        type: "shard/message",
        content,
        channel,
        sentBy,
        sentAt: new Date(),
    };
    if (latticeSocket.readyState === WebSocket.OPEN)
        latticeSocket.send(JSON.stringify(message));
};

export const shardMessageHandler = ({
    incomingMessage,
    setMessages,
}: {
    incomingMessage: ShardMessage;
    setMessages: Dispatch<SetStateAction<Array<ShardMessage>>>;
}) => {
    setMessages((prev) => [...prev, incomingMessage]);
};
