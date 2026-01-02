import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LucideDownload, LucideShare2, LucideType, LucideShield, LucidePalette, LucideLoader2 } from 'lucide-react';
import { encodeBase64, caesarCipher, simpleCipher, getSecurityLevel } from '../utils/crypto';
import { encodeDataToPattern, DATA_BLOCK_SIZE } from '../utils/steganography';

const STYLES = [
  { id: 'dog', name: 'Dog', icon: '🐶' },
  { id: 'cat', name: 'Cat', icon: '🐱' },
  { id: 'wave', name: 'Waveform', icon: '📊' },
];

const METHODS = [
  { id: 'base64', name: 'Base64' },
  { id: 'caesar', name: 'Caesar' },
  { id: 'custom', name: 'Custom' },
];

export default function CreateSticker() {
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState('base64');
  const [style, setStyle] = useState('dog');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  
  const canvasRef = useRef(null);

  const security = getSecurityLevel(method);

  const generateSticker = () => {
    setIsGenerating(true);
    setGeneratedImage(null);

    // Simulate loading for "premium" feel
    setTimeout(() => {
      drawSticker();
      setIsGenerating(false);
    }, 1500);
  };

  const drawSticker = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#6366f1');
    grad.addColorStop(1, '#a855f7');
    
    ctx.fillStyle = grad;
    // Rounded rect background
    drawRoundedRect(ctx, 10, 10, w - 20, h - 20, 40);
    ctx.fill();

    // Shadow/Glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(0,0,0,0.2)';

    // Encode Message
    let encoded = message;
    if (method === 'base64') encoded = encodeBase64(message);
    else if (method === 'caesar') encoded = caesarCipher(message);
    else if (method === 'custom') encoded = simpleCipher(message);

    const bits = encodeDataToPattern(encoded);

    if (style === 'wave') {
      drawWaveform(ctx, w, h, bits);
    } else if (style === 'dog') {
      drawAnimal(ctx, w, h, 'dog', bits);
    } else {
      drawAnimal(ctx, w, h, 'cat', bits);
    }

    // Border
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, 10, 10, w - 20, h - 20, 40);
    ctx.stroke();

    setGeneratedImage(canvas.toDataURL('image/png'));
    
    // Store for demo purposes
    localStorage.setItem('last_codesticker', JSON.stringify({
      text: message,
      method: METHODS.find(m => m.id === method).name,
      timestamp: Date.now()
    }));
  };

  const drawRoundedRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const drawWaveform = (ctx, w, h, bits) => {
    const barCount = 40;
    const barWidth = (w - 100) / barCount;
    const centerY = h / 2;
    
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    
    for (let i = 0; i < barCount; i++) {
      // Use bits to influence bar height if available, otherwise random
      const bitIndex = i % bits.length;
      const height = bits[bitIndex] ? 80 : 30;
      const x = 50 + i * barWidth;
      
      ctx.beginPath();
      drawRoundedRect(ctx, x + 2, centerY - height/2, barWidth - 4, height, 4);
      ctx.fill();
    }
    
    // Hidden data dots at the bottom
    drawDataGrid(ctx, w, h, bits);
  };

  const drawAnimal = (ctx, w, h, type, bits) => {
    ctx.fillStyle = 'white';
    ctx.font = '120px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(type === 'dog' ? '🐶' : '🐱', w/2, h/2 - 20);
    
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText("CodeSticker", w/2, h/2 + 80);

    drawDataGrid(ctx, w, h, bits);
  };

  const drawDataGrid = (ctx, w, h, bits) => {
    // Draw bits as a subtle grid at the bottom
    const size = 6;
    const cols = 20;
    const startX = (w - (cols * size)) / 2;
    const startY = h - 60;
    
    bits.forEach((bit, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      if (row > 4) return; // Limit rows
      
      ctx.fillStyle = bit ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)';
      ctx.fillRect(startX + col * size, startY + row * size, size - 1, size - 1);
    });
  };

  const downloadSticker = () => {
    const link = document.createElement('a');
    link.download = `codesticker-${Date.now()}.png`;
    link.href = generatedImage;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <LucideType size={16} /> SECRET MESSAGE
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your secret message here..."
            className="w-full h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 focus:ring-2 ring-indigo-500 outline-none transition-all resize-none"
          />
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-6">
          <div className="space-y-3">
            <label className="flex items-center justify-between text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2"><LucideShield size={16} /> ENCODING METHOD</span>
              <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 ${security.color}`}>
                {security.level} Security
              </span>
            </label>
            <div className="flex gap-2">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                    method === m.id 
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <LucidePalette size={16} /> STICKER STYLE
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`py-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                    style === s.id 
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30 scale-105' 
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs font-bold">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateSticker}
            disabled={!message || isGenerating}
            className="w-full premium-button bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <LucideLoader2 className="animate-spin" /> Generating...
              </span>
            ) : 'Generate Sticker'}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="relative group">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="hidden"
          />
          
          <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-[3rem] overflow-hidden shadow-2xl relative">
            {!generatedImage && !isGenerating && (
              <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-4 text-4xl">
                  ✨
                </div>
                <h3 className="text-xl font-bold mb-2">Ready to create?</h3>
                <p className="text-slate-500 text-sm">Enter a message and choose a style to see the magic happen.</p>
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-xl flex flex-col items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-6"
                >
                  🎨
                </motion.div>
                <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full bg-indigo-500"
                  />
                </div>
              </div>
            )}

            {generatedImage && (
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={generatedImage}
                alt="Generated Sticker"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {generatedImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 mt-8"
            >
              <button
                onClick={downloadSticker}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform"
              >
                <LucideDownload size={18} /> Download
              </button>
              <button
                className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform"
              >
                <LucideShare2 size={18} /> Share
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
