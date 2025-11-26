import React from 'react';
import { Article } from '../types';
import { Calendar, ArrowRight, User as UserIcon, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-slate-100 flex flex-col h-full group">
      <div className="relative overflow-hidden h-48">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {article.category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-slate-500 text-sm mb-3 space-x-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(article.createdAt).toLocaleDateString('zh-CN')}
          </div>
          <div className="flex items-center">
             <UserIcon className="w-4 h-4 mr-1" />
             {article.authorName}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
          <Link to={`/article/${article.id}`}>{article.title}</Link>
        </h3>
        
        <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">
          {article.summary}
        </p>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map(tag => (
              <Link 
                key={tag}
                to={`/news?tag=${encodeURIComponent(tag)}`}
                className="inline-flex items-center text-xs text-slate-500 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 px-2 py-1 rounded-md transition-colors"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Link>
            ))}
          </div>
        )}
        
        <Link 
          to={`/article/${article.id}`} 
          className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-800 transition-colors mt-auto"
        >
          阅读全文 <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};