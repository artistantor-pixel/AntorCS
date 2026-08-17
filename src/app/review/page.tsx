"use client";

import { useState } from "react";
import { Star, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ReviewSubmissionPage() {
  const [formData, setFormData] = useState({
    clientName: "",
    role: "",
    content: "",
    rating: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit review");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface border border-border p-8 rounded-3xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-3xl font-bold font-serif mb-4">Thank You!</h1>
          <p className="text-muted mb-8">
            Your review has been successfully submitted. We appreciate your feedback and time!
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            className="w-full bg-brand-red text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors"
          >
            Return to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 py-20">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Share Your Experience</h1>
          <p className="text-muted text-lg">We value your feedback. Let us know how we did!</p>
        </div>

        <div className="bg-surface border border-border p-8 rounded-3xl shadow-xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-muted mb-2">Full Name *</label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red transition-colors"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-muted mb-2">Role / Company (Optional)</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red transition-colors"
                placeholder="e.g. Project Manager, ABC Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-muted mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      size={32} 
                      className={star <= formData.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-muted mb-2">Your Review *</label>
              <textarea
                required
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red transition-colors resize-none"
                placeholder="Share your thoughts about working with us..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-red text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Submitting...</span>
              ) : (
                <>
                  <Send size={20} />
                  Submit Review
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
