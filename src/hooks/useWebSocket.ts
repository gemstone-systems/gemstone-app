import type { ShardMessage } from "@/lib/types/messages";
import {
    validateHistoryMessage,
    validateNewMessage,
    validateWsMessageString,
    validateWsMessageType,
} from "@/lib/validators";
import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
    const [messages, setMessages] = useState<ShardMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Connect to WebSocket
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            console.log("Connected to WebSocket");
            setIsConnected(true);
        };

        ws.current.onmessage = (event) => {
            const eventData = validateWsMessageString(event.data);
            if (!eventData) return;

            const data: unknown = JSON.parse(eventData);
            const wsMessage = validateWsMessageType(data);
            if (!wsMessage) return;

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

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.current.onclose = () => {
            console.log("Disconnected from WebSocket");
            setIsConnected(false);
        };

        // Cleanup on unmount
        return () => {
            ws.current?.close();
        };
    }, [url]);

    const sendMessage = (text: string) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(
                JSON.stringify({
                    type: "shard/message",
                    text,
                    timestamp: new Date(),
                }),
            );
        }
    };

    return { messages, isConnected, sendMessage };
}
