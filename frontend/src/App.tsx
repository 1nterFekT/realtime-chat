import { useState, useRef } from "react";

import Notification from "./components/notification";
import Message from "./components/message";

export type Message =
    | {
          type: "message";
          username: string;
          text: string;
          timestamp: string;
      }
    | {
          type: "user_joined" | "user_left";
          username: string;
      };

export default function App() {
    const [isConnected, setConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const socketRef = useRef<WebSocket | null>(null);

    const usernameSubmitHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const username = new FormData(e.currentTarget).get("name") as string;
        const socket = new WebSocket("ws://localhost:8000/ws");
        socketRef.current = socket;

        socket.onopen = () => {
            socket.send(
                JSON.stringify({
                    username,
                }),
            );

            setConnected(true);
        };

        socket.onmessage = (event) => {
            const data: Message = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
        };

        socket.onclose = () => {
            console.log("Соединение закрыто");
            setConnected(false);
        };

        socket.onerror = (error) => {
            console.error("Ошибка WebSocket:", error);
        };
    };

    const messageSubmitHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const text = formData.get("message") as string;

        if (!text.trim()) return;

        socketRef.current?.send(
            JSON.stringify({
                text,
            }),
        );

        form.reset();
    };

    return (
        <>
            {!isConnected && (
                <form onSubmit={usernameSubmitHandler}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Ваше имя"
                        required
                        style={{ marginRight: "10px" }}
                    />

                    <button type="submit">Продолжить</button>
                </form>
            )}

            {isConnected && (
                <form onSubmit={messageSubmitHandler}>
                    {messages.map((message, index) => {
                        switch (message.type) {
                            case "message":
                                return (
                                    <Message
                                        key={index}
                                        author={message.username}
                                        text={message.text}
                                        timestamp={message.timestamp}
                                    />
                                );

                            case "user_joined":
                                return (
                                    <Notification
                                        key={index}
                                        text={`${message.username} подключился к чату`}
                                    />
                                );

                            case "user_left":
                                return (
                                    <Notification
                                        key={index}
                                        text={`${message.username} покинул чат`}
                                    />
                                );
                        }
                    })}

                    <input
                        name="message"
                        placeholder="Сообщение..."
                        style={{ marginRight: "10px" }}
                    />

                    <button type="submit">Отправить</button>
                </form>
            )}
        </>
    );
}
