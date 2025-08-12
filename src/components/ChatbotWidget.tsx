'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-main text-bg-main rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center"
        aria-label="Open chatbot"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-main/20">
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/zxLByjPEJ01Ymma2MXpVc"
            width="100%"
            style={{ height: '100%', minHeight: '500px' }}
            frameBorder="0"
            className="rounded-lg"
            title="Auctor Chatbot"
          />
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
