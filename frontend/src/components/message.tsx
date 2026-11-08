type MessageProps = {
    author: string;
    text: string;
    timestamp: string;
};

export default function Message({ author, text, timestamp }: MessageProps) {
    return (
        <div style={{ marginBottom: "15px" }}>
            <strong>{author}</strong>
            <p style={{ margin: "0px 0px 5px" }}>{text}</p>

            {timestamp && (
                <small>{new Date(timestamp).toLocaleString("RU-ru")}</small>
            )}
        </div>
    );
}
