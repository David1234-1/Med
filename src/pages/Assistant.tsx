import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Brain,
  Loader,
  MessageSquare
} from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Assistant: React.FC = () => {
  const { courses } = useStudy();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Bonjour ! Je suis votre assistant IA pour la médecine. Je peux vous aider avec vos cours, répondre à vos questions et vous expliquer des concepts médicaux. Que puis-je faire pour vous ?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simuler la réponse IA locale
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateResponse(inputValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Réponses basées sur le contenu des cours
    if (input.includes('cœur') || input.includes('cardiaque') || input.includes('cardiovasculaire')) {
      return `Le système cardiovasculaire comprend le cœur et les vaisseaux sanguins. Le cœur est un muscle qui pompe le sang dans tout le corps. Il a quatre cavités : deux oreillettes et deux ventricules. Le sang transporte l'oxygène et les nutriments vers les tissus.`;
    }
    
    if (input.includes('anatomie')) {
      return `L'anatomie est la science qui étudie la structure et l'organisation des êtres vivants. En médecine, elle se concentre sur l'étude de la structure du corps humain, des organes, des tissus et de leurs relations spatiales.`;
    }
    
    if (input.includes('physiologie')) {
      return `La physiologie étudie le fonctionnement des organes et des systèmes du corps humain. Elle explique comment les différents organes travaillent ensemble pour maintenir l'homéostasie et assurer la survie de l'organisme.`;
    }
    
    if (input.includes('qcm') || input.includes('question')) {
      return `Je peux vous aider à créer des QCM basés sur vos cours importés. Les QCM sont un excellent moyen de tester vos connaissances et de vous préparer aux examens. Voulez-vous que je génère des questions sur un sujet particulier ?`;
    }
    
    if (input.includes('flashcard') || input.includes('carte')) {
      return `Les flashcards sont des cartes avec une question d'un côté et la réponse de l'autre. Elles sont très efficaces pour la mémorisation. Je peux créer des flashcards à partir de vos cours importés.`;
    }
    
    if (input.includes('aide') || input.includes('help')) {
      return `Je peux vous aider de plusieurs façons :
      • Répondre à vos questions sur la médecine
      • Expliquer des concepts médicaux
      • Créer des QCM et flashcards à partir de vos cours
      • Vous donner des conseils d'étude
      • Clarifier des points de vos cours importés`;
    }
    
    // Réponse générique
    return `Merci pour votre question ! Je suis un assistant IA spécialisé en médecine. Je peux vous aider avec vos cours, répondre à vos questions médicales et vous expliquer des concepts. N'hésitez pas à me poser des questions spécifiques sur l'anatomie, la physiologie, ou tout autre sujet médical.`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-screen flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full"
      >
        {/* Header */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Assistant IA
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Posez vos questions sur la médecine
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-primary-600' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    
                    <div className={`rounded-lg px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' 
                          ? 'text-primary-100' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Loader className="w-4 h-4 animate-spin text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        L'assistant réfléchit...
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez votre question..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className="flex items-start space-x-3">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Assistant IA local
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Toutes les réponses sont générées localement dans votre navigateur. 
                Aucune donnée n'est envoyée vers des serveurs externes.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Assistant;