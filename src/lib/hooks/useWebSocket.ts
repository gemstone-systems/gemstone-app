import type { DidPlc, DidWeb } from "@/lib/types/atproto";
import type { ShardMessage } from "@/lib/types/messages";
import {
    validateHistoryMessage,
    validateNewMessage,
    validateWsMessageString,
    validateWsMessageType,
} from "@/lib/validators";
import { useFirstSessionWsTemp } from "@/providers/authed/SessionsProvider";
import { useEffect, useState } from "react";

export function useWebSocket() {
    const [messages, setMessages] = useState<Array<ShardMessage>>([]);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useFirstSessionWsTemp();

    useEffect(() => {
        if (!ws) return;
        ws.onopen = () => {
            console.log("Connected to WebSocket");
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            const eventData = validateWsMessageString(event.data);
            if (!eventData) return;

            const data: unknown = JSON.parse(eventData);
            const validateResult = validateWsMessageType(data);
            if (!validateResult.ok) return;

            const { data: wsMessage } = validateResult;
            if (wsMessage.type === "shard/history") {
                const history = validateHistoryMessage(wsMessage);
                if (!history) return;
                if (history.messages) setMessages(history.messages);
            } else {
                const message = validateNewMessage(wsMessage);
                if (!message) return;
                setMessages((prev) => [...prev, message]);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("Disconnected from WebSocket");
            setIsConnected(false);
        };

        // Cleanup on unmount
        return () => {
            ws.close();
        };
    }, [ws]);

    const sendMessage = ({ text, did }: SendMessageOpts) => {
        if (!ws) return;
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    type: "shard/message",
                    text,
                    did,
                    timestamp: new Date(),
                }),
            );
        }
    };

    return { messages, isConnected, sendMessage };
}

export interface SendMessageOpts {
    text: string;
    did: DidPlc | DidWeb;
}
