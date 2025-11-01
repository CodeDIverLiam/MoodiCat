import { useState } from "react";
import { Send } from "lucide-react";
import logoImage from "../assets/logo.png";
import { api } from "../api/client";
import { useTodayMoodSummary } from "../hooks/useReports";

export default function AIChatPanel() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hi! I\'m your Moodicat assistant. How are you feeling today? 🐱',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { mood, isLoading: isMoodLoading, refetch: refetchMood } = useTodayMoodSummary();

  const handleMoodClick = () => {
    refetchMood();
  };

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      const userMessage = {
        id: messages.length + 1,
        type: 'user',
        content: inputValue,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      const currentInput = inputValue;
      setInputValue('');
      setIsLoading(true);
      setError(null);

      try {
        console.log('Sending message to AI:', currentInput);
        console.log('Token:', localStorage.getItem('aiDiaryToken'));
        
        const response = await api.post('/ai/chat', {
          message: currentInput
        });
        
        console.log('AI Response:', response.data);
        
        // 确保响应内容是字符串，处理可能的对象响应
        let responseContent = response.data;
        if (typeof responseContent !== 'string') {
          // 如果是对象，尝试提取文本或转换为字符串
          if (responseContent && typeof responseContent === 'object') {
            // 如果是工具调用对象，提取有用信息或使用默认消息
            if (responseContent.tool_name) {
              responseContent = `I'm processing your request using ${responseContent.tool_name}...`;
            } else {
              // 尝试 JSON 序列化，或使用默认消息
              try {
                responseContent = JSON.stringify(responseContent);
              } catch (e) {
                responseContent = 'I processed your request. Please check if the action was completed successfully.';
              }
            }
          } else {
            responseContent = String(responseContent || 'Sorry, I couldn\'t process that request.');
          }
        }
        
        const aiMessage = {
          id: messages.length + 2,
          type: 'ai',
          content: responseContent,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('AI Chat error:', error);
        console.error('Error details:', error.response?.data);
        setError(error?.response?.data || 'Sorry, I\'m having trouble connecting. Please try again later.');
        
        const errorMessage = {
          id: messages.length + 2,
          type: 'ai',
          content: error?.response?.data || 'Sorry, I\'m having trouble connecting. Please try again later.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="card-modern h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src={logoImage} 
              alt="Moodicat Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Moodicat Assistant</h3>
            <p className="text-sm text-gray-500">Your AI companion for mood tracking</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          {/* Today's Mood Panel */}
          <div
            title="Click to re-analyze mood"
            onClick={handleMoodClick}
            className="px-3 py-2 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-lg flex items-center justify-center min-w-[80px] cursor-pointer hover:from-teal-500 hover:to-cyan-600 transition-all active:from-teal-600 active:to-cyan-700"
          >
            {isMoodLoading ? (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            ) : mood ? (
              (() => {
                const englishOnly = mood.replace(/[^\x00-\x7F]/g, '').trim();
                return englishOnly ? (
                  <span className="text-xs font-semibold">{englishOnly}</span>
                ) : (
                  <span className="text-xs font-semibold">...</span>
                );
              })()
            ) : (
              <span className="text-xs font-semibold">...</span>
            )}
          </div>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="w-full px-4 py-3 input-modern focus:outline-none"
            />
          </div>
          
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center hover:from-teal-500 hover:to-cyan-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
