import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import chatbotImage from '../../assets/chatbot_image.png';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm your JanSetu assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!inputMessage.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputMessage('');

        // Simulate bot response (mock)
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm currently in development mode. I'll be fully functional soon to assist you with schemes and services!",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 w-80 sm:w-96 mb-4 overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-200 flex flex-col h-[500px] max-h-[80vh]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2 text-white">
                            <div className="p-1 bg-white/20 rounded-lg backdrop-blur-md overflow-hidden w-8 h-8 flex items-center justify-center">
                                <img src={chatbotImage} alt="AI" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">JanSetu AI</h3>
                                <div className="flex items-center gap-1.5 opacity-80">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                    <span className="text-[10px] font-medium">Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`
                                    max-w-[80%] rounded-2xl p-3 text-sm relative group
                                    ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none shadow-sm'
                                    }
                                `}>
                                    {msg.text}
                                    <span className={`
                                        text-[10px] absolute bottom-1 ${msg.sender === 'user' ? 'left-2 text-blue-100' : 'right-2 text-gray-400'} opacity-0 group-hover:opacity-100 transition-opacity
                                    `}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                        <form
                            onSubmit={handleSendMessage}
                            className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
                        >
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your query..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 text-gray-700 placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim()}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-gray-400">Powered by JanSetu Advanced Agentic AI</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    pointer-events-auto rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden
                    ${isOpen
                        ? 'bg-white border border-gray-200 p-4 rotate-90 text-gray-600'
                        : 'bg-transparent p-0 w-16 h-16' // Removed gradient background for image mode
                    }
                `}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <img src={chatbotImage} alt="Chat" className="w-full h-full object-cover" />
                )}
            </button>
        </div>
    );
};

export default Chatbot;
