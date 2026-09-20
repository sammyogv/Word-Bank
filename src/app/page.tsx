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
import { BookA, Volume2, Plus, Sparkles, Loader2 } from "lucide-react";

export default function Home() {
  const [words, setWords] = useState<WordBank[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [newWord, setNewWord] = useState("");
  const [newPhonetic, setNewPhonetic] = useState("");
  const [newMeaning, setNewMeaning] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord || !newMeaning) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "WordBank"), {
        word: newWord,
        phoneticTranscription: newPhonetic,
        meaning: newMeaning,
        createdAt: Timestamp.now(),
      });
      setNewWord("");
      setNewPhonetic("");
      setNewMeaning("");
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setIsSubmitting(false);
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
            <p className="text-slate-500 font-medium">Build your personal vocabulary</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Add Word Form */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="text-blue-500" size={20} />
                New Word
              </h2>
              <form onSubmit={handleAddWord} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Word <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g. Ephemeral"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phonetics
                  </label>
                  <input 
                    type="text" 
                    value={newPhonetic}
                    onChange={(e) => setNewPhonetic(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g. /əˈfem(ə)rəl/"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Meaning <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    value={newMeaning}
                    onChange={(e) => setNewMeaning(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Lasting for a very short time."
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                  Add to Bank
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
                <p className="text-sm">Start adding words using the form!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {words.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between">
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
                        <p className="mt-3 text-slate-600 leading-relaxed text-lg">
                          {entry.meaning}
                        </p>
                      </div>
                    </div>
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
