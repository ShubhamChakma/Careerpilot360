import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import api from '../../lib/api';
import Spinner from '../../components/ui/Spinner';

export default function DocReader() {
  const { slug } = useParams();
  const { isDark } = useThemeStore();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/docs/${slug}`);
        setContent(res.data.content);
      } catch { setContent('Failed to load content. Please try again.'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [slug]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/docs" className={`inline-flex items-center gap-1 text-xs mb-6 transition-colors ${isDark ? 'text-[#4A4A4A] hover:text-[#C0C0C0]' : 'text-[#999] hover:text-[#333]'}`}>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Docs Hub
      </Link>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className={`metal-card rounded-2xl p-8 prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''}`}>
          <pre className={`whitespace-pre-wrap font-body text-sm leading-relaxed ${isDark ? 'text-[#A8A8A8]' : 'text-[#555]'}`}>{content}</pre>
        </div>
      )}
    </div>
  );
}