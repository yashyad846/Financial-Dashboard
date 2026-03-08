"use client";

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function SmartInput({ onAddTransaction }: { onAddTransaction?: (data: any) => void }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      // Send the user's sentence to our Gemini backend
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });

      if (!res.ok) throw new Error('Failed to parse with AI');
      
      const data = await res.json();
      
      // Log it to the console so we can see the magic!
      console.log("🧠 AI Parsed Data:", data);
      
      // If we have a function to update the dashboard, call it
      if (onAddTransaction) {
         onAddTransaction(data);
      }
      
      setInput(''); // Clear the input field
    } catch (error) {
      console.error(error);
      alert("Oops, the AI couldn't parse that. Check the console for errors.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mb-8 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., 'Spent $45 on an Uber ride to the airport today'"
          className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-slate-800"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {isLoading ? 'Thinking...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}