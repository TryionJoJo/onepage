import React, { useEffect, useState } from 'react';
import { Article } from '../types';
import { storageService } from '../services/storage';
import { ArticleCard } from '../components/ArticleCard';
import { ArrowRight, Activity, Anchor, Zap, ChevronRight, ChevronLeft, Tag, X, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const tagFilter = searchParams.get('tag');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await storageService.getPublicArticles();
        setArticles(data);
      } catch (error) {
        console.error("Failed to load articles", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (tagFilter) {
      const filtered = articles.filter(a => a.tags && a.tags.includes(tagFilter));
      setFilteredArticles(filtered);
    } else {
      setFilteredArticles(articles);
    }
  }, [articles, tagFilter]);

  // News Carousel Logic
  useEffect(() => {
    if (articles.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % articles.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [articles.length]);

  const featuredArticle = articles[currentNewsIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      
      {/* Hero Section - Only show if not filtering */}
      {!tagFilter && (
        <>
          <div className="relative bg-slate-900 overflow-hidden h-[600px]">
            <div className="absolute inset-0">
              <img
                className="w-full h-full object-cover opacity-30"
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                alt="Engineering Structure"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                精工细作 <br />
                <span className="text-blue-500">筑就未来</span>
              </h1>
              <p className="mt-4 max-w-xl text-xl text-slate-300 mb-8 leading-relaxed">
                Apex 工程解决方案提供世界一流的基础设施、可持续能源系统和先进的结构设计。
              </p>
              <div className="flex space-x-4">
                <Link to="/projects" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-colors">
                  我们的项目
                </Link>
                <Link to="/about" className="inline-flex items-center px-8 py-3 border border-slate-500 text-base font-medium rounded-md text-slate-300 hover:text-white hover:border-white md:text-lg transition-colors">
                  联系我们
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-4">
                        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                            <Anchor className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">基础设施</h3>
                        <p className="mt-2 text-slate-500">在全球范围内完成了500多座桥梁和道路项目。</p>
                    </div>
                    <div className="p-4 border-l-0 md:border-l border-slate-100">
                        <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
                            <Zap className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">能源系统</h3>
                        <p className="mt-2 text-slate-500">工业工厂可再生能源整合的先行者。</p>
                    </div>
                    <div className="p-4 border-l-0 md:border-l border-slate-100">
                        <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
                            <Activity className="w-8 h-8 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">工程咨询</h3>
                        <p className="mt-2 text-slate-500">针对大型项目的战略规划和可行性研究。</p>
                    </div>
                </div>
            </div>
          </div>
        </>
      )}

      {/* Featured News / Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900">
                  {tagFilter ? `标签: ${tagFilter}` : '最新动态'}
                </h2>
                <p className="mt-2 text-slate-500">
                  {tagFilter 
                    ? `显示 ${filteredArticles.length} 篇相关文章。` 
                    : '来自现场和公司总部的最新消息。'}
                </p>
            </div>
            {tagFilter ? (
               <Link to="/news" className="text-red-500 font-semibold hover:text-red-700 flex items-center">
                  <X className="w-4 h-4 mr-1" /> 清除筛选
               </Link>
            ) : (
               <Link to="/news" className="text-blue-600 font-semibold hover:text-blue-800 flex items-center">
                   查看全部 <ArrowRight className="w-4 h-4 ml-1" />
               </Link>
            )}
        </div>

        {!tagFilter && articles.length > 0 && featuredArticle && (
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden min-h-[400px] flex flex-col md:flex-row border border-slate-200 mb-12">
            {/* Carousel Controls (Mobile/Desktop) */}
            <div className="absolute top-4 right-4 z-10 flex space-x-2">
                <button 
                  onClick={() => setCurrentNewsIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1))}
                  className="p-2 bg-white/90 rounded-full shadow hover:bg-white text-slate-800 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setCurrentNewsIndex((prev) => (prev + 1) % articles.length)}
                  className="p-2 bg-white/90 rounded-full shadow hover:bg-white text-slate-800 transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div className="md:w-1/2 relative h-64 md:h-auto">
               <img 
                 key={featuredArticle.imageUrl} // force re-render for animation
                 src={featuredArticle.imageUrl} 
                 alt={featuredArticle.title} 
                 className="w-full h-full object-cover animate-fade-in"
               />
               <div className="absolute top-4 left-4">
                 <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase">
                    推荐
                 </span>
               </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-slate-50">
               <div className="flex items-center text-sm text-slate-500 mb-4 space-x-4">
                  <span>{new Date(featuredArticle.createdAt).toLocaleDateString('zh-CN')}</span>
                  <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                  <span>{featuredArticle.category}</span>
               </div>
               <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                 <Link to={`/article/${featuredArticle.id}`} className="hover:text-blue-600 transition-colors">
                    {featuredArticle.title}
                 </Link>
               </h3>
               <p className="text-slate-600 mb-6 text-lg line-clamp-3">
                 {featuredArticle.summary}
               </p>
               
               {featuredArticle.tags && featuredArticle.tags.length > 0 && (
                 <div className="flex flex-wrap gap-2 mb-8">
                   {featuredArticle.tags.map(tag => (
                     <Link 
                       key={tag}
                       to={`/news?tag=${encodeURIComponent(tag)}`}
                       className="inline-flex items-center text-xs text-slate-600 bg-slate-200 hover:bg-blue-100 hover:text-blue-700 px-2 py-1 rounded-md transition-colors"
                     >
                       <Tag className="w-3 h-3 mr-1" />
                       {tag}
                     </Link>
                   ))}
                 </div>
               )}

               <Link to={`/article/${featuredArticle.id}`} className="inline-flex items-center font-bold text-blue-700 hover:text-blue-900">
                 阅读全文 <ArrowRight className="w-5 h-5 ml-2" />
               </Link>
            </div>
          </div>
        )}

        {!tagFilter && articles.length === 0 && (
            <div className="text-center py-12 text-slate-500">暂无新闻文章。</div>
        )}

        {/* Grid of articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(tagFilter ? filteredArticles : articles.slice(1, 4)).map(article => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>
        
        {tagFilter && filteredArticles.length === 0 && (
            <div className="text-center py-12 bg-slate-100 rounded-lg border border-slate-200">
               <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <p className="text-slate-500">未找到带有 "{tagFilter}" 标签的文章。</p>
               <Link to="/news" className="text-blue-600 hover:underline mt-2 inline-block">查看所有新闻</Link>
            </div>
        )}
      </div>
    </div>
  );
};
