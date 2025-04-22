import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const Transliterator = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.5 + 0.2,
    }));

    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
      }
      requestAnimationFrame(drawStars);
    }

    drawStars();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const url = "https://transliterate-python.onrender.com/transliterate";
      // const url = 'http://127.0.0.1:8000/transliterate';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'API request failed');
      }

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        throw new Error('Transliteration failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to transliterate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white pt-24 pb-12 px-4 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-purple-300 drop-shadow-lg mb-4">
            English to Hindi Transliterator
          </h1>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Convert English words and phrases into Hindi script with our powerful AI-powered transliteration tool
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/10 mb-12"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="englishText" className="block text-sm font-medium text-rose-100 mb-2">
                Enter English Text
              </label>
              <textarea
                id="englishText"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent text-white placeholder-purple-200"
                rows="4"
                placeholder="Type your English text here..."
                required
              />
            </div>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Transliterate to Hindi'}
            </motion.button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 bg-rose-900/50 text-rose-100 rounded-lg border border-rose-700"
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {result && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-rose-300 mb-4 pb-2 border-b border-white/10">
                Word-by-Word Translation
              </h3>
              <div className="space-y-4">
                {result.word_results.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-2 font-bold text-rose-300">English:</div>
                      <div className="col-span-10">{item.english}</div>
                      <div className="col-span-2 font-bold text-rose-300">Hindi:</div>
                      <div className="col-span-10 text-indigo-200">{item.hindi}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-purple-900/50 to-rose-900/50 rounded-xl p-6 border border-white/10 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-white/10">
                Complete Sentence
              </h3>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-2 font-bold text-rose-300">English:</div>
                <div className="col-span-10">{result.full_sentence.english}</div>
                <div className="col-span-2 font-bold text-rose-300">Hindi:</div>
                <div className="col-span-10 text-indigo-200 font-medium">{result.full_sentence.hindi}</div>
              </div>
            </motion.div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <h4 className="text-sm font-medium text-purple-300 mb-2">TRY THESE EXAMPLES</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {['Namaste', 'Janamdivas', 'I love programming', 'How are you?', 'I love India'].map((phrase) => (
              <motion.button
                key={phrase}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setText(phrase)}
                className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition-colors"
              >
                {phrase}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Transliterator;