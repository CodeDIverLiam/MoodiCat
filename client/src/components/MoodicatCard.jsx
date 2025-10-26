import FeatureCard from "./FeatureCard";

export default function MoodicatCard() {
  return (
    <section className="bg-white p-8 flex flex-col h-full rounded-2xl shadow-lg border border-gray-100">
      {/* Top area - Moodicat and feature cards */}
      <div className="flex-1 flex flex-col items-center justify-center">
      <div className="w-48 h-48 mb-8 bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner border border-purple-200">
        {/* Cat emoji as placeholder for now */}
        <div className="text-8xl">🐱</div>
      </div>
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          <FeatureCard 
            title="Jot Down Feelings" 
            desc="Record your thoughts and feelings"
          />
          <FeatureCard 
            title="Record & Goal Setting" 
            desc="Manage your daily tasks and goals"
          />
        </div>
      </div>
      
      {/* Bottom input interface */}
      <div className="mt-8">
        {/* Header info bar */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-100 px-6 py-3 rounded-t-2xl flex justify-between items-center border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-md" style={{backgroundColor: '#8B5CF6'}}>
              <span className="text-white text-xs font-bold">🐱</span>
            </div>
            <span className="text-sm text-gray-700 font-medium">Unlocked more with Pro Plan</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Powered by Moodicat v1.0</span>
            <div className="w-5 h-5 text-gray-500">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Input area */}
        <div className="bg-white p-6 rounded-b-2xl shadow-lg border border-purple-200 border-t-0">
          {/* Input box and buttons */}
          <div className="flex items-center gap-4 mb-6">
            <button className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full flex items-center justify-center hover:from-purple-200 hover:to-pink-300 transition-all duration-200 shadow-md hover:shadow-lg">
              <span className="text-2xl text-purple-600">+</span>
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type your message or select an action below..."
                className="w-full px-6 py-4 border-2 border-purple-200 rounded-full text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>
            
            <button className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full flex items-center justify-center hover:from-purple-200 hover:to-pink-300 transition-all duration-200 shadow-md hover:shadow-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            
            <button className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          {/* Quick action buttons */}
          <div className="flex gap-3 flex-wrap">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Record Things
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Goal Setting
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Jot Down Feelings
            </button>
            <button className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
