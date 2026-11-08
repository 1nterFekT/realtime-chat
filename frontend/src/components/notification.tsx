type NotificationProps = {
    text: string;
};

export default function Notification({ text }: NotificationProps) {
    return <p>{text}</p>;
}
