"use client";

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function SmartInput({ onAddTransaction }: { onAddTransaction?: (data: any) => void }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

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
      setStatus({
        type: "success",
        message: "Expense added to your transactions.",
      });
      setInput(''); // Clear the input field
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: "Could not understand that sentence. Please try rephrasing.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full rounded-xl border border-border bg-secondary px-4 py-3 shadow-sm space-y-2">
      {status && (
        <div
          className={`text-xs rounded-md px-3 py-2 ${
            status.type === "success"
              ? "bg-emerald-900/40 text-emerald-300"
              : "bg-red-900/40 text-red-300"
          }`}
        >
          {status.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe one expense in a sentence, e.g. “Spent $45 on Uber to the airport today”."
          className="flex-1 px-2 py-2 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {isLoading ? 'Thinking...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}