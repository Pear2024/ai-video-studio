'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Video, Clapperboard, BookOpen, Clock, Globe, FileText, Link as LinkIcon, Type } from 'lucide-react';

export default function StudioPage() {
  const [inputType, setInputType] = useState<'text' | 'url' | 'file'>('text');
  
  const [topic, setTopic] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [mood, setMood] = useState('Epic');
  const [style, setStyle] = useState('Cinematic');
  const [duration, setDuration] = useState('30 sec');
  const [platform, setPlatform] = useState('YouTube Shorts');
  const [christianMode, setChristianMode] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (topic) formData.append('topic', topic);
      if (url) formData.append('url', url);
      if (file) formData.append('file', file);
      
      formData.append('mood', mood);
      formData.append('style', style);
      formData.append('duration', duration);
      formData.append('platform', platform);
      formData.append('christianMode', String(christianMode));

      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to generate');
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error generating storyboard. Please check your API keys or file size.");
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = topic.trim() !== '' || url.trim() !== '' || file !== null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12 font-sans selection:bg-purple-500/30">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            AI Prompt-to-Video Studio
          </h1>
          <p className="text-slate-400 text-lg">
            Generate cinematic storyboards from text, links, or PDF files.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl"
        >
          <form onSubmit={handleGenerate} className="space-y-8">
            
            {/* Input Type Selector */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-300">Choose Source Material</label>
              <div className="flex p-1 bg-slate-950/50 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setInputType('text')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${inputType === 'text' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  <Type className="w-4 h-4" /> Text
                </button>
                <button
                  type="button"
                  onClick={() => setInputType('url')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${inputType === 'url' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  <LinkIcon className="w-4 h-4" /> Website Link
                </button>
                <button
                  type="button"
                  onClick={() => setInputType('file')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${inputType === 'file' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  <FileText className="w-4 h-4" /> PDF Document
                </button>
              </div>

              {/* Dynamic Inputs */}
              <div className="mt-4">
                {inputType === 'text' && (
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Describe your story idea here... (e.g. David vs Goliath)"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500/50 outline-none resize-none h-32"
                  />
                )}
                
                {inputType === 'url' && (
                  <input 
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500/50 outline-none"
                  />
                )}

                {inputType === 'file' && (
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors bg-slate-950/30">
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden" 
                      id="file-upload" 
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 text-purple-400" />
                      <span className="text-slate-300 font-medium">Click to upload PDF</span>
                      <span className="text-slate-500 text-sm">{file ? file.name : 'Max size: 5MB'}</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2 text-slate-300">
                  <BookOpen className="w-4 h-4 text-pink-400" /> Mood
                </label>
                <select value={mood} onChange={(e) => setMood(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 focus:ring-purple-500/50 appearance-none">
                  <option>Epic</option><option>Emotional</option><option>Mysterious</option><option>Uplifting</option><option>Dark</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2 text-slate-300">
                  <Clapperboard className="w-4 h-4 text-orange-400" /> Visual Style
                </label>
                <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 focus:ring-purple-500/50 appearance-none">
                  <option>Cinematic</option><option>Anime</option><option>Disney Style</option><option>Documentary</option><option>Bible Epic</option><option>Realistic</option><option>Sci-Fi</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-blue-400" /> Duration
                </label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 focus:ring-purple-500/50 appearance-none">
                  <option>30 sec</option><option>60 sec</option><option>90 sec</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2 text-slate-300">
                  <Globe className="w-4 h-4 text-green-400" /> Platform
                </label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 focus:ring-purple-500/50 appearance-none">
                  <option>YouTube Shorts</option><option>TikTok</option><option>Instagram Reels</option><option>YouTube Long Form</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
              <div>
                <h4 className="font-semibold text-slate-200">Christian Cinematic Mode</h4>
                <p className="text-xs text-slate-500">Generates spiritual narration & biblical themes.</p>
              </div>
              <button type="button" onClick={() => setChristianMode(!christianMode)} className={`w-12 h-6 rounded-full transition-colors relative ${christianMode ? 'bg-purple-500' : 'bg-slate-700'}`}>
                <motion.div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" animate={{ x: christianMode ? 24 : 0 }} />
              </button>
            </div>

            <button 
              type="submit"
              disabled={isGenerating || !isFormValid}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Sparkles className="w-5 h-5" /></motion.div> Director is thinking...</>
              ) : (
                <><Video className="w-5 h-5" /> Generate Storyboard</>
              )}
            </button>
          </form>
        </motion.div>

        {/* Results UI */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 mt-12">
            <div className="bg-slate-900/80 border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-2">{result.title}</h2>
              <p className="text-pink-400 font-medium mb-6">🔥 Hook: {result.viral_hook}</p>
              
              <div className="bg-slate-950 rounded-xl p-4 mb-8 text-slate-300">
                <p><strong>Summary:</strong> {result.summary}</p>
                <p className="mt-2 text-sm text-slate-400">🎵 Mood: {result.music_mood}</p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold border-b border-slate-800 pb-2">Storyboard</h3>
                {result.scenes.map((scene: any, idx: number) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-purple-600 text-white font-bold px-3 py-1 rounded-lg text-sm">Scene {scene.scene_number}</span>
                      <span className="text-slate-400 text-sm">🎥 {scene.camera}</span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-slate-200">Visual</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{scene.visual}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-slate-200">Narration</h4>
                        <p className="text-slate-400 text-sm leading-relaxed italic border-l-2 border-purple-500 pl-3">"{scene.narration}"</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/50 space-y-3">
                      <div className="bg-slate-900 rounded-lg p-3">
                        <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block mb-1">🖼 Image Prompt</span>
                        <code className="text-xs text-slate-300 font-mono">{scene.image_prompt}</code>
                      </div>
                      <div className="bg-slate-900 rounded-lg p-3">
                        <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block mb-1">🎞 Video Prompt</span>
                        <code className="text-xs text-slate-300 font-mono">{scene.video_prompt}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20 rounded-xl p-6 text-center">
                <p className="text-xl font-bold text-white mb-2">Call to Action (CTA)</p>
                <p className="text-slate-300">{result.cta}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
