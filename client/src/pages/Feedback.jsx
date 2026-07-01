import React, { useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function Feedback() {
  const { isDark } = useThemeStore();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setSubmitError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Feedback message cannot be empty';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setSubmitError('');
    try {
      await api.post('/feedback', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setSubmitError(
        err.response?.data?.error?.message || 
        err.response?.data?.message || 
        'Something went wrong. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative gradient glowing blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-zinc-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-zinc-400/5 blur-[120px] pointer-events-none" />

      <div className={`w-full max-w-xl p-8 rounded-3xl border transition-all duration-300 relative z-10 ${
        isDark 
          ? 'bg-[#121212]/90 border-zinc-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md' 
          : 'bg-white/90 border-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-md'
      }`}>
        {submitted ? (
          <div className="text-center py-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-display mb-2">Thank you for your feedback!</h2>
            <p className={`text-sm mb-8 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Your message has been sent successfully. We appreciate your input to help us improve CareerPilot360.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isDark 
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/50' 
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300/50'
                }`}
              >
                Submit another response
              </button>
              <Link
                to="/"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-zinc-200 to-zinc-100 hover:from-white hover:to-zinc-200 text-black shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                Go to Home
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-display tracking-tight mb-2 bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Share Your Feedback
              </h1>
              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Have an idea, bug report, or general feedback? We'd love to hear from you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none focus:ring-1 ${
                    isDark 
                      ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:ring-zinc-500' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:ring-zinc-400'
                  } ${errors.name ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none focus:ring-1 ${
                    isDark 
                      ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:ring-zinc-500' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:ring-zinc-400'
                  } ${errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="message" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Feedback Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you think or how we can improve..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none resize-none focus:ring-1 ${
                    isDark 
                      ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:ring-zinc-500' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:ring-zinc-400'
                  } ${errors.message ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1.5">{errors.message}</p>}
              </div>

              {submitError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-zinc-100 text-black hover:bg-white active:scale-[0.98]'
                    : 'bg-zinc-900 text-white hover:bg-black active:scale-[0.98]'
                } disabled:opacity-50 disabled:pointer-events-none`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
