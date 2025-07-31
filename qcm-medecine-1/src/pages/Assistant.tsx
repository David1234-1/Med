import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis votre assistant IA pour vos révisions médicales. Comment puis-je vous aider aujourd\'hui ?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simuler une réponse de l'IA
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Je comprends votre question. Pour vous aider au mieux, pourriez-vous me donner plus de détails sur le sujet que vous étudiez ?',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col"
      >
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Assistant IA
          </h1>
          <p className="text-gray-600">
            Posez vos questions sur vos cours de médecine
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                  message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`p-2 rounded-full ${
                    message.isUser 
                      ? 'bg-blue-100' 
                      : 'bg-gray-100'
                  }`}>
                    {message.isUser ? (
                      <User className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    <Bot className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Questions suggérées
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Expliquez-moi le système cardiovasculaire',
              'Qu\'est-ce que l\'anatomie ?',
              'Comment fonctionne le système nerveux ?',
              'Quelles sont les bases de la physiologie ?'
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputValue(suggestion)}
                className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              >
                <p className="text-sm text-gray-700">{suggestion}</p>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Assistant;