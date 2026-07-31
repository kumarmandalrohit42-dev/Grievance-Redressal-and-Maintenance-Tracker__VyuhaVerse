import React, { useState, useEffect, useRef } from 'react';
import { Send, X, CheckCheck, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';
import { ChatMessage, Complaint } from '../../types';

interface LiveChatDrawerProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LiveChatDrawer: React.FC<LiveChatDrawerProps> = ({
  complaint,
  isOpen,
  onClose,
}) => {
  const { currentUser, activeRole } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!complaint) return;
    const update = () => {
      setMessages(store.getChatMessages(complaint.id));
    };
    update();
    return store.subscribe(update);
  }, [complaint]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen || !complaint) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    store.sendChatMessage({
      complaintId: complaint.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: activeRole,
      text: inputText.trim(),
    });

    setInputText('');

    if (activeRole === 'student' && complaint.technicianName) {
      setTimeout(() => {
        setIsTyping(true);
      }, 1000);

      setTimeout(() => {
        setIsTyping(false);
        store.sendChatMessage({
          complaintId: complaint.id,
          senderId: complaint.technicianId || 'tech-auto',
          senderName: complaint.technicianName || 'Technician',
          senderRole: 'technician',
          text: `Acknowledged! I am currently handling your ${complaint.category} request. Will update status shortly.`,
        });
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">{complaint.trackingNumber} Live Chat</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium truncate max-w-[280px]">
            {complaint.title}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-slate-200/70 text-slate-500 hover:text-slate-900"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2 font-medium">
            <MessageSquare className="w-10 h-10 text-slate-300" />
            <p className="text-xs">No messages yet. Start conversation with technician or department head.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-400 font-mono font-bold mb-1">
                  {msg.senderName} ({msg.senderRole})
                </span>
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs space-y-1 shadow-xs ${
                    isMe
                      ? 'bg-brand-600 text-white rounded-tr-none font-medium'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 font-medium'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 text-[9px] opacity-75 font-mono">
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono animate-pulse">
            <span className="w-2 h-2 rounded-full bg-brand-600" />
            <span>{complaint.technicianName} is typing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-600 font-medium"
        />
        <button
          type="submit"
          className="p-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md shadow-brand-500/20 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
