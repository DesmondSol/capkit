

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { MindsetData, Language } from '../../types';
import { TranslationKey } from '../../types';
import { askAiMindsetCoach } from '../../services/geminiService';

interface AiCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  mindsetData: MindsetData;
  onUpdateMindsetData: (data: MindsetData) => void; // For updating chat history
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
}

const AiCoachModal: React.FC<AiCoachModalProps> = ({
  isOpen,
  onClose,
  mindsetData,
  onUpdateMindsetData,
  language,
  t,
}) => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatHistory = mindsetData.goalSettingAiChatHistory || [];
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  // Add initial welcome message if history is empty
  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      const welcomeMessage = { role: 'model' as const, parts: [{text: t('mindset_ai_coach_welcome_message')}]};
      onUpdateMindsetData({
        ...mindsetData,
        goalSettingAiChatHistory: [welcomeMessage],
      });
    }
  }, [isOpen, chatHistory.length, mindsetData, onUpdateMindsetData, t]);


  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    const newUserMessage = { role: 'user' as const, parts: [{text: userInput.trim()}] };
    const updatedHistory = [...chatHistory, newUserMessage];
    
    // Optimistically update UI with user's message
    onUpdateMindsetData({...mindsetData, goalSettingAiChatHistory: updatedHistory});
    setUserInput('');

    try {
      const aiResponse = await askAiMindsetCoach(mindsetData.goals, userInput.trim(), updatedHistory, language);
      const newAiMessage = { role: 'model' as const, parts: [{text: aiResponse}] };
      onUpdateMindsetData({...mindsetData, goalSettingAiChatHistory: [...updatedHistory, newAiMessage]});
    } catch (error) {
      console.error("Error with AI Coach:", error);
      const errorMessage = { role: 'model' as const, parts: [{text: t('error_ai_failed_generic')}] };
      onUpdateMindsetData({...mindsetData, goalSettingAiChatHistory: [...updatedHistory, errorMessage]});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('mindset_ai_coach_modal_title')} size="lg">
      <div className="flex flex-col h-[60vh]">
        <div ref={chatContainerRef} className="flex-grow space-y-3 overflow-y-auto p-4 bg-slate-700/30 rounded-lg mb-4">
          {chatHistory.map((entry, index) => (
            <div key={index} className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[75%] p-3 rounded-xl shadow whitespace-pre-wrap
                  ${entry.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-600 text-slate-100'
                  }`}
              >
                {entry.parts[0].text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
                 <div className="max-w-[75%] p-3 rounded-xl shadow bg-slate-600 text-slate-100">
                    <SpinnerIcon className="h-5 w-5"/>
                 </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3 pt-3 border-t border-slate-700">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder={t('mindset_ai_coach_input_placeholder')}
            className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} variant="primary">
            {isLoading ? <SpinnerIcon className="h-5 w-5"/> : <SendIcon className="h-5 w-5"/>}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" {...props} className={`animate-spin ${props.className || ''}`}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M3.105 3.105a.75.75 0 01.814-.153l12 4.5a.75.75 0 010 1.342l-12 4.5a.75.75 0 01-.966-.996l2.5-5.5a.75.75 0 010-.198l-2.5-5.5a.75.75 0 01.152-.843z" />
    </svg>
);


export default AiCoachModal;