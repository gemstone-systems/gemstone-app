import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
    const [messages, setMessages] = useState<
        { text: string; timestamp: string }[]
    >([]);
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
            const data = JSON.parse(event.data);

            if (data.type === "shard/history") {
                setMessages(data.messages);
            } else if (data.type === "shard/message") {
                setMessages((prev) => [
                    ...prev,
                    { text: data.text, timestamp: data.timestamp },
                ]);
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
