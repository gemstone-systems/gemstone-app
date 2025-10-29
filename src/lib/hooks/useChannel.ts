import type { AtUri } from "@/lib/types/atproto";
import type { ShardMessage } from "@/lib/types/messages";
import { atUriToString } from "@/lib/utils/atproto";
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
        if (!sessionInfo)
            throw new Error(
                "Channel did not resolve to a valid sessionInfo object.",
            );
        if (!socket)
            throw new Error(
                "Session info did not resolve to a valid websocket connection. This should not happen and is likely a bug. Check the sessions map object.",
            );

        // attach handlers here

        socket.addEventListener("open", () => {
            console.log("Connected to WebSocket");
            setIsConnected(true);
        });

        socket.addEventListener("message", (event) => {
            const validateEventResult = validateWsMessageString(event.data);
            if (!validateEventResult.ok) return;

            const data: unknown = JSON.parse(validateEventResult.data);
            const validateTypeResult = validateWsMessageType(data);
            if (!validateTypeResult.ok) return;

            const { type: messageType } = validateTypeResult.data;

            switch (messageType) {
                case "shard/message":
                    setMessages((prev) => [
                        ...prev,
                        validateTypeResult.data as ShardMessage,
                    ]);
            }
        });

        socket.addEventListener("error", (error) => {
            console.error("WebSocket error:", error);
        });

        socket.addEventListener("close", () => {
            console.log("Disconnected from WebSocket");
            setIsConnected(false);
        });
    }, [socket, sessionInfo]);

    if (!oAuthSession) throw new Error("No OAuth session");
    if (!sessionInfo)
        throw new Error(
            "Channel did not resolve to a valid sessionInfo object.",
        );
    if (!socket)
        throw new Error(
            "Session info did not resolve to a valid websocket connection. This should not happen and is likely a bug. Check the sessions map object.",
        );

    const channelStringified = atUriToString(channel);

    const sendMessageToChannel = (content: string) => {
        sendShardMessage(
            {
                content,
                channel: channelStringified,
                sentBy: oAuthSession.did,
            },
            socket,
        );
    };

    return { sessionInfo, socket, messages, isConnected, sendMessageToChannel };
};
