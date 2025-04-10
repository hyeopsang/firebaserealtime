import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, push, onChildAdded, DataSnapshot } from 'firebase/database';
import "../src/index.css"
type Chat = {
  username: string;
  message: string;
  timestamp: number;
};

function ChatApp() {
  const [username, setUsername] = useState<string>('익명');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Chat[]>([]);

  // 메시지 전송
  const sendMessage = () => {
    const chatRef = ref(db, 'chats');
    const newMessage: Chat = {
      username,
      message,
      timestamp: Date.now(),
    };
    push(chatRef, newMessage);
    setMessage('');
  };

  // 실시간 메시지 수신
  useEffect(() => {
    const chatRef = ref(db, 'chats');

    const unsubscribe = onChildAdded(chatRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val() as Chat;
      setMessages((prev) => [...prev, data]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className='chat'>
      <h2>채팅</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="닉네임"
      />
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지"
      />
      <button onClick={sendMessage}>보내기</button>

      <div style={{ marginTop: '20px' }}>
        {messages.map((chat, idx) => (
          <div key={idx}>
            <strong>{chat.username}:</strong> {chat.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatApp;
