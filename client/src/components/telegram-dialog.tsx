import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Smile, Paperclip } from 'lucide-react';
import { DecorativeAvatar } from './decorative-avatar';
import { useAuth } from '@/hooks/use-auth';
import type { Employee } from '@/types';

interface Message {
  id: string;
  text: string;
  senderId: number;
  senderName: string;
  timestamp: Date;
  type: 'text' | 'sticker';
  stickerUrl?: string;
}

interface TelegramDialogProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
}

// Хранилище сообщений в localStorage
const getDialogMessages = (employeeId: number): Message[] => {
  const stored = localStorage.getItem(`dialog_${employeeId}`);
  if (!stored) return [];
  return JSON.parse(stored).map((msg: any) => ({
    ...msg,
    timestamp: new Date(msg.timestamp)
  }));
};

const saveDialogMessages = (employeeId: number, messages: Message[]) => {
  localStorage.setItem(`dialog_${employeeId}`, JSON.stringify(messages));
};

export function TelegramDialog({ employee, isOpen, onClose }: TelegramDialogProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showStickers, setShowStickers] = useState(false);

  // Стикеры
  const stickers = [
    { id: 'hippo', url: '/attached_assets/image_1751740444640.png', name: 'Бегемот' },
    // Можно добавить больше стикеров
  ];

  useEffect(() => {
    if (isOpen) {
      const dialogMessages = getDialogMessages(employee.id);
      setMessages(dialogMessages);
    }
  }, [isOpen, employee.id]);

  const sendMessage = (text: string, type: 'text' | 'sticker' = 'text', stickerUrl?: string) => {
    if (!user || (!text.trim() && type === 'text')) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: text,
      senderId: user.id,
      senderName: user.name,
      timestamp: new Date(),
      type,
      stickerUrl
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    saveDialogMessages(employee.id, updatedMessages);
    setNewMessage('');
  };

  const handleSendSticker = (sticker: { url: string; name: string }) => {
    sendMessage(sticker.name, 'sticker', sticker.url);
    setShowStickers(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(newMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg w-full max-w-md h-[600px] mx-4 flex flex-col">
        {/* Заголовок диалога */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-700">
          <DecorativeAvatar employee={employee} size="md" showFrame={true} />
          <div className="flex-1">
            <h3 className="font-semibold text-white">{employee.name}</h3>
            <p className="text-xs text-gray-400">
              {employee.role === 'admin' ? 'Администратор' : 
               employee.role === 'worker' ? 'Работник' : 'Гость'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Область сообщений */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Начните разговор с {employee.name}</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.senderId === user?.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    {message.type === 'sticker' ? (
                      <div className="text-center">
                        <img 
                          src={message.stickerUrl} 
                          alt={message.text}
                          className="w-24 h-24 object-contain mx-auto rounded"
                        />
                        <p className="text-xs mt-1 opacity-75">{message.text}</p>
                      </div>
                    ) : (
                      <p className="text-sm">{message.text}</p>
                    )}
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString('ru-RU', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Панель стикеров */}
        {showStickers && (
          <div className="border-t border-gray-700 p-4">
            <div className="grid grid-cols-4 gap-2">
              {stickers.map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => handleSendSticker(sticker)}
                  className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <img 
                    src={sticker.url} 
                    alt={sticker.name}
                    className="w-12 h-12 object-contain mx-auto"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Панель ввода */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStickers(!showStickers)}
              className="text-gray-400 hover:text-white"
            >
              <Smile className="h-4 w-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Сообщение..."
              className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
            <Button
              onClick={() => sendMessage(newMessage)}
              disabled={!newMessage.trim()}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}