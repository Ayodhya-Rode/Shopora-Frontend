import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import { sendChatMessage, type ChatProduct } from "../api/chatbotApi";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
  products?: ChatProduct[];
}

function ChatWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setSending(true);

    try {
      const { reply, products } = await sendChatMessage(trimmed);
      setMessages((prev) => [...prev, { role: "bot", text: reply, products }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="flex h-120 w-80 flex-col rounded-2xl border border-border-default bg-surface-card shadow-xl">
          <div className="flex items-center justify-between rounded-t-2xl bg-chat-accent px-4 py-3">
            <span className="text-sm font-medium text-white">Support Chat</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white hover:opacity-70"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-chat-accent text-white"
                        : "bg-surface-muted text-text-primary"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>

                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    {msg.products.map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => {
                          navigate(`/product/${p._id}`);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-card p-2 text-left transition hover:border-chat-accent"
                      >
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-surface-muted" />
                        )}
                        <div className="flex-1">
                          <p className="text-xs font-medium text-text-primary">
                            {p.name}
                          </p>
                          <p className="text-xs text-text-secondary">
                            ₹{p.discountPrice || p.price}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-xl bg-surface-muted px-3 py-2 text-sm text-text-secondary">
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-2 border-t border-border-default p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-border-default px-3 py-2 text-sm outline-none focus:border-chat-accent"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-chat-accent text-white disabled:opacity-50"
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-chat-accent text-white shadow-lg transition hover:bg-chat-accent-hover"
          aria-label="Open chat"
        >
          <FiMessageCircle size={24} />
        </button>
      )}
    </div>
  );
}

export default ChatWidget;