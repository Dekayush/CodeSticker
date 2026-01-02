import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LucideHome, LucidePlus, LucideScan, LucideMoon, LucideSun, LucideArrowLeft } from 'lucide-react'
import CreateSticker from './components/CreateSticker'
import ScanSticker from './components/ScanSticker'

export default function App() {
  const [view, setView] = useState('home')
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen transition-colors duration-500 bg-premium-light dark:bg-premium-dark text-slate-900 dark:text-slate-100">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" 
        />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-500/5 rounded-full blur-[100px]" />
      </div>

      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center backdrop-blur-md border-b border-white/10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setView('home')}
          className="text-3xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent cursor-pointer"
        >
          CodeSticker
        </motion.div>
        
        <div className="flex gap-4 items-center">
          <button 
            onClick={toggleTheme}
            className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center hover:scale-110 transition-all hover:shadow-lg hover:shadow-indigo-500/20"
          >
            {isDark ? <LucideSun size={22} className="text-yellow-400" /> : <LucideMoon size={22} className="text-indigo-600" />}
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
              className="space-y-20"
            >
              <section className="text-center space-y-8 max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold tracking-widest uppercase mb-6 inline-block">
                    The Future of Secret Sharing
                  </span>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8">
                    Turn Secrets <br />
                    <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent italic">
                      Into Art.
                    </span>
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-xl md:text-2xl leading-relaxed">
                    A premium tool to encode hidden messages into visually stunning stickers. 
                    Scan art to reveal the truth.
                  </p>
                </motion.div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <ActionButton 
                  icon={<LucidePlus size={36} />}
                  title="Create Sticker"
                  description="Transform your text into a unique visual sticker"
                  onClick={() => setView('create')}
                  color="from-indigo-500 to-blue-600"
                  delay={0.4}
                />
                <ActionButton 
                  icon={<LucideScan size={36} />}
                  title="Scan Sticker"
                  description="Upload or scan a sticker to decode the message"
                  onClick={() => setView('scan')}
                  color="from-purple-500 to-pink-600"
                  delay={0.5}
                />
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col items-center gap-4 text-slate-400"
              >
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-premium-light dark:border-premium-dark bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl">
                      {['🐶', '🐱', '📊', '✨'][i-1]}
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium">Join 10,000+ creators sharing secrets beautifully.</p>
              </motion.div>
            </motion.div>
          )}

          {view === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setView('home')} 
                  className="group flex items-center gap-3 text-slate-500 hover:text-indigo-500 transition-all font-bold"
                >
                  <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <LucideArrowLeft size={20} />
                  </div>
                  Back to Home
                </button>
                <h2 className="text-2xl font-black">Create Art</h2>
              </div>
              <CreateSticker />
            </motion.div>
          )}

          {view === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setView('home')} 
                  className="group flex items-center gap-3 text-slate-500 hover:text-indigo-500 transition-all font-bold"
                >
                  <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <LucideArrowLeft size={20} />
                  </div>
                  Back to Home
                </button>
                <h2 className="text-2xl font-black">Scan Sticker</h2>
              </div>
              <ScanSticker />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 px-6 text-center text-slate-400 text-sm border-t border-white/5">
        <p>© 2026 CodeSticker. Handcrafted for secret agents and artists.</p>
      </footer>
    </div>
  )
}

function ActionButton({ icon, title, description, onClick, color, delay }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, translateY: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-card p-10 rounded-[3.5rem] text-left group transition-all duration-500 hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] hover:border-indigo-500/30"
    >
      <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl group-hover:shadow-indigo-500/40`}>
        {icon}
      </div>
      <h3 className="text-3xl font-black mb-3">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{description}</p>
      
      <div className="mt-8 flex items-center gap-2 text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
        Get Started →
      </div>
    </motion.button>
  )
}

