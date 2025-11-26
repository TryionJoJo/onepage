import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Article } from '../types';
import { storageService } from '../services/storage';
import { ArrowLeft, Calendar, User, Clock, Share2, Tag, Loader2 } from 'lucide-react';

export const ArticleView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          const found = await storageService.getArticleById(id);
          setArticle(found || null);
        } catch (error) {
          console.error("Error fetching article", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
           <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
     );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">未找到文章</h2>
          <Link to="/news" className="text-blue-600 hover:underline mt-4 inline-block">返回新闻列表</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/news" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> 返回新闻列表
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-96 relative">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
               <span className="inline-block px-3 py-1 bg-blue-600 text-xs font-bold rounded-md uppercase tracking-wider mb-4">
                  {article.category}
               </span>
               <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                 {article.title}
               </h1>
            </div>
          </div>

          <div className="p-8 md:p-12">
             <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-8 mb-8 gap-4">
                <div className="flex items-center space-x-6 text-slate-500 text-sm md:text-base">
                   <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                   </div>
                   <div className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      {article.authorName}
                   </div>
                   <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      5分钟阅读
                   </div>
                </div>
                <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
                   <Share2 className="w-5 h-5 mr-2" /> 分享
                </button>
             </div>

             <div className="prose prose-lg prose-slate max-w-none">
                <p className="lead text-xl text-slate-600 mb-8 font-medium">
                  {article.summary}
                </p>
                <div className="whitespace-pre-line text-slate-800 leading-relaxed mb-8">
                  {article.content}
                </div>
             </div>

             {/* Tags Section */}
             {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-100">
                   <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">标签</h4>
                   <div className="flex flex-wrap gap-2">
                     {article.tags.map(tag => (
                       <Link 
                         key={tag}
                         to={`/news?tag=${encodeURIComponent(tag)}`}
                         className="inline-flex items-center px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                       >
                         <Tag className="w-4 h-4 mr-2" />
                         {tag}
                       </Link>
                     ))}
                   </div>
                </div>
             )}
          </div>
        </article>
      </div>
    </div>
  );
};
