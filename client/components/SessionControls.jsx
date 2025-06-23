import { useState } from "react";
import { CloudLightning, CloudOff, MessageSquare } from "react-feather";
import Button from "./Button";

// 入力検証とサニタイゼーション関数
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  // 長さ制限（最大1000文字）
  const maxLength = 1000;
  let sanitized = input.slice(0, maxLength);
  
  // HTMLタグを除去
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // 特殊文字をエスケープ
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized.trim();
}

function validateMessage(message) {
  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'メッセージが空です' };
  }
  
  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: 'メッセージが空です' };
  }
  
  if (trimmed.length > 1000) {
    return { isValid: false, error: 'メッセージは1000文字以内で入力してください' };
  }
  
  // 潜在的に危険なパターンをチェック
  const dangerousPatterns = [
    /<script[^>]*>/i,
    /javascript:/i,
    /vbscript:/i,
    /on\w+\s*=/i,
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return { isValid: false, error: '無効な文字が含まれています' };
    }
  }
  
  return { isValid: true, sanitized: sanitizeInput(trimmed) };
}

function SessionStopped({ startSession }) {
  const [isActivating, setIsActivating] = useState(false);

  function handleStartSession() {
    if (isActivating) return;

    setIsActivating(true);
    startSession();
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Button
        onClick={handleStartSession}
        className={isActivating ? "bg-gray-600" : "bg-red-600"}
        icon={<CloudLightning height={16} />}
      >
        {isActivating ? "starting session..." : "start session"}
      </Button>
    </div>
  );
}

function SessionActive({ stopSession, sendTextMessage }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSendClientEvent() {
    const validation = validateMessage(message);
    
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }
    
    setError("");
    sendTextMessage(validation.sanitized);
    setMessage("");
  }
  
  function handleInputChange(e) {
    const value = e.target.value;
    setMessage(value);
    
    // リアルタイムでエラーをクリア
    if (error && value.trim().length > 0) {
      setError("");
    }
  }

  return (
    <div className="flex flex-col w-full h-full gap-2">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}
      <div className="flex items-center justify-center w-full flex-1 gap-4">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter" && message.trim()) {
              handleSendClientEvent();
            }
          }}
          type="text"
          placeholder="send a text message... (max 1000 characters)"
          className={`border rounded-full p-4 flex-1 ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200'
          }`}
          value={message}
          onChange={handleInputChange}
          maxLength={1000}
        />
        <Button
          onClick={() => {
            if (message.trim()) {
              handleSendClientEvent();
            }
          }}
          icon={<MessageSquare height={16} />}
          className="bg-blue-400"
          disabled={!!error}
        >
          send text
        </Button>
        <Button onClick={stopSession} icon={<CloudOff height={16} />}>
          disconnect
        </Button>
      </div>
      <div className="text-xs text-gray-500 px-4 pb-2">
        Characters: {message.length}/1000
      </div>
    </div>
  );
}

export default function SessionControls({
  startSession,
  stopSession,
  sendClientEvent,
  sendTextMessage,
  serverEvents,
  isSessionActive,
}) {
  return (
    <div className="flex gap-4 border-t-2 border-gray-200 h-full rounded-md">
      {isSessionActive ? (
        <SessionActive
          stopSession={stopSession}
          sendClientEvent={sendClientEvent}
          sendTextMessage={sendTextMessage}
          serverEvents={serverEvents}
        />
      ) : (
        <SessionStopped startSession={startSession} />
      )}
    </div>
  );
}
