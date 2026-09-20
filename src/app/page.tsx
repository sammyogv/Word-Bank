"use client";

import { useEffect, useState } from "react";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WordBank } from "@/models/WordBank";
import { BookA, Volume2, Plus, Sparkles, Loader2, Quote } from "lucide-react";

export default function Home() {
  const [words, setWords] = useState<WordBank[]>([]);
  const [loading, setLoading] = useState(true);
  
  // AI Form State
  const [newWord, setNewWord] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const q = query(collection(db, "WordBank"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const wordsData: WordBank[] = [];
      querySnapshot.forEach((doc) => {
        wordsData.push({ id: doc.id, ...doc.data() } as WordBank);
      });
      setWords(wordsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching words: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAIAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;

    setIsGenerating(true);
    setErrorMsg("");

    try {
      // 1. Fetch AI details
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: newWord.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate word details");
      }

      // 2. Save to Firestore
      await addDoc(collection(db, "WordBank"), {
        word: newWord.trim(),
        phoneticTranscription: data.phoneticTranscription || "",
        meaning: data.meaning || "",
        exampleSentence: data.exampleSentence || "",
        createdAt: Timestamp.now(),
      });
      
      setNewWord("");
    } catch (error: any) {
      console.error("Error adding document: ", error);
      setErrorMsg(error.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-8 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
            <BookA size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              Word Bank
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              AI-Powered Vocabulary Builder
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Add Word Form */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-8">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="text-amber-500" size={20} />
                Magic Add
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Type a word and AI will automatically find the meaning, phonetics, and generate an example sentence.
              </p>
              
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleAIAddWord} className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-lg"
                    placeholder="Enter a word..."
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isGenerating || !newWord.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-slate-300"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Add to Bank
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Word List */}
          <div className="md:col-span-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                <Loader2 className="animate-spin" size={32} />
                <p>Loading your vocabulary...</p>
              </div>
            ) : words.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <BookA size={48} className="mb-4 text-slate-300" />
                <p className="text-lg font-medium text-slate-600">Your bank is empty</p>
                <p className="text-sm">Try the Magic Add to discover new words!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {words.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 capitalize tracking-tight flex items-baseline gap-3">
                          {entry.word}
                          {entry.phoneticTranscription && (
                            <span className="text-sm font-normal text-slate-400 flex items-center gap-1">
                              <Volume2 size={14} />
                              {entry.phoneticTranscription}
                            </span>
                          )}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 leading-relaxed text-lg mb-4">
                      {entry.meaning}
                    </p>

                    {entry.exampleSentence && (
                      <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4 flex gap-3 text-slate-700">
                        <Quote size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="italic">{entry.exampleSentence}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
