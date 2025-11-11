import type { AtUri } from "@/lib/types/atproto";
import type { RequestHistoryMessage, ShardMessage } from "@/lib/types/messages";
import { historyMessageSchema, shardMessageSchema } from "@/lib/types/messages";
import { atUriEquals, atUriToString, stringToAtUri } from "@/lib/utils/atproto";
import { sendShardMessage } from "@/lib/utils/messages";
import {
    validateWsMessageString,
    validateWsMessageType,
} from "@/lib/validators";
import { useSessions } from "@/providers/authed/SessionsProvider";
import { useOAuthSession } from "@/providers/OAuthProvider";
import { useEffect, useState } from "react";

export const useChannel = (channel: AtUri) => {
    const [messages, setMessages] = useState<Array<ShardMessage>>([]);
    const [isConnected, setIsConnected] = useState(false);
    const { findChannelSession } = useSessions();
    const oAuthSession = useOAuthSession();

    const { sessionInfo, socket } = findChannelSession(channel);

    useEffect(() => {
        if (!sessionInfo) {
            console.warn(
                "Channel did not resolve to a valid sessionInfo object.",
            );
            return;
        }
        if (!socket) {
            console.warn(
                "Session info did not resolve to a valid websocket connection. This should not happen and is likely a bug. Check the sessions map object.",
            );
            return;
        }

        // attach handlers here

        const handleOpen = () => {
            console.log("Connected to WebSocket");
            setIsConnected(true);
            const requestHistoryMessage: RequestHistoryMessage = {
                type: "shard/requestHistory",
                channel: atUriToString(channel),
                requestedBy: sessionInfo.clientDid,
            };
            console.log(
                "requested history from lattice",
                requestHistoryMessage,
            );
            socket.send(JSON.stringify(requestHistoryMessage));
        };

        socket.addEventListener("message", (event) => {
            console.log("received message", event);
            const validateEventResult = validateWsMessageString(event.data);
            if (!validateEventResult.ok) return;

            const data: unknown = JSON.parse(validateEventResult.data);
            const validateTypeResult = validateWsMessageType(data);
            if (!validateTypeResult.ok) return;

            const { type: messageType } = validateTypeResult.data;

            switch (messageType) {
                case "shard/message": {
                    const { success, data: shardMessage } =
                        shardMessageSchema.safeParse(validateTypeResult.data);
                    if (!success) return;

                    const parseChannelResult = stringToAtUri(
                        shardMessage.channel,
                    );

                    if (!parseChannelResult.ok) return;
                    const { data: channelAtUri } = parseChannelResult;

                    if (atUriEquals(channelAtUri, channel))
                        setMessages((prev) => [...prev, shardMessage]);
                    break;
                }
                case "shard/history": {
                    console.log(
                        "received history from lattice",
                        validateTypeResult.data,
                    );
                    const { success, data: historyMessage } =
                        historyMessageSchema.safeParse(validateTypeResult.data);
                    if (!success) return;
                    if (!historyMessage.messages) return;

                    const parseChannelResult = stringToAtUri(
                        historyMessage.channel,
                    );

                    if (!parseChannelResult.ok) return;
                    const { data: channelAtUri } = parseChannelResult;

                    if (atUriEquals(channelAtUri, channel))
                        setMessages([...historyMessage.messages]);
                }
            }
        });

        socket.addEventListener("error", (error) => {
            console.error("WebSocket error:", error);
        });

        socket.addEventListener("close", () => {
            console.log("Disconnected from WebSocket");
            setIsConnected(false);
        });

        if (socket.readyState === WebSocket.OPEN) {
            handleOpen();
        }

        socket.addEventListener("open", handleOpen);

        return () => {
            socket.removeEventListener("open", handleOpen);
        };
    }, [socket, sessionInfo, channel]);

    if (!oAuthSession) {console.warn("No OAuth session"); return }
    if (!sessionInfo) {
        console.warn(
            "Channel did not resolve to a valid sessionInfo object.",
        );
        return;
    }
    if (!socket) {
        console.warn(
            "Session info did not resolve to a valid websocket connection. This should not happen and is likely a bug. Check the sessions map object.",
        );
        return;
    }

    const channelStringified = atUriToString(channel);

    const sendMessageToChannel = (content: string) => {
        sendShardMessage(
            {
                content,
                channel: channelStringified,
                sentBy: oAuthSession.did,
                routedThrough: sessionInfo.latticeDid,
            },
            socket,
        );
    };

    return { sessionInfo, socket, messages, isConnected, sendMessageToChannel };
};
