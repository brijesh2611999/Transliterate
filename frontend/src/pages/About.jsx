import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 mb-6">
            About Our Transliterator
          </h1>
          <p className="text-lg text-purple-200 max-w-3xl mx-auto">
            Bridging languages through advanced AI technology
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-2xl font-semibold text-rose-300 mb-4">Our Technology</h2>
            <p className="mb-4">
              Using state-of-the-art neural networks trained on millions of bilingual text pairs, our system provides the most accurate English-to-Hindi transliteration available.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-rose-300 mr-2">•</span>
                <span>Aksharantar Dataset(120000) Trained - 75000</span>
              </li>
              <li className="flex items-start">
                <span className="text-rose-300 mr-2">•</span>
                <span>Deep learning architecture</span>
              </li>
              <li className="flex items-start">
                <span className="text-rose-300 mr-2">•</span>
                <span>Continuous improvement</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-2xl font-semibold text-rose-300 mb-4">Our Mission</h2>
            <p className="mb-4">
              We're committed to breaking down language barriers between English and Hindi speakers through accessible technology.
            </p>
            <div className="bg-gradient-to-r from-rose-900/50 to-purple-900/50 p-4 rounded-lg">
              <p className="italic">
                "To create seamless communication experiences that respect linguistic diversity while maintaining cultural authenticity."
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <h2 className="text-2xl font-semibold text-rose-300 mb-4">Development Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {['MCA Student (Brijesh Verma)', 'Linguists', 'Developers'].map((role, i) => (
              <motion.div
                key={role}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-purple-900/30 to-rose-900/30 p-4 rounded-lg border border-white/10"
              >
                <h3 className="font-medium text-rose-200 mb-2">{role}</h3>
                <p className="text-sm text-purple-100">
                  {[
                    "Knowledge about neural networks",
                    "Native Hindi language know",
                    "Full-stack developer"
                  ][i]}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;