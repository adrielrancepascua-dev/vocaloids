"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../contexts/ModalProvider';
import { trackEvent } from '../lib/analytics';

export function EmailModal() {
  const { isOpen, closeModal } = useModal();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      localStorage.setItem('vocaloid_subscriber', email);
      trackEvent('email_capture', { email });
      setSubmitted(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md rounded-2xl border border-white/20 bg-zinc-900 p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-inter-tight text-white tracking-widest">
                FREE WALLPAPER PACK
              </h2>
              <button 
                onClick={closeModal}
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                
              </button>
            </div>
            
            {submitted ? (
              <div className="text-center py-8">
                <p className="text-[#39C5BB] font-bold text-xl mb-4">ACCESS GRANTED</p>
                <a 
                  href="#"
                  className="inline-block rounded-full bg-[#39C5BB] px-8 py-3 text-sm font-bold text-black hover:bg-white transition-colors"
                >
                  DOWNLOAD ZIP
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-zinc-400 mb-6 font-light">
                  Unlock 4K desktop and mobile wallpapers. Enter your email to begin the download sequence.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your transmission address..."
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-zinc-600 focus:border-[#39C5BB] focus:outline-none focus:ring-1 focus:ring-[#39C5BB]"
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#39C5BB] px-4 py-3 font-bold text-black transition-colors hover:bg-white"
                >
                  INITIALIZE DOWNLOAD
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
