import React, { useEffect, useState } from 'react';
import { storageService } from '../../services/storage';
import { Eye, FileText, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article } from '../../types';

export const Dashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
       try {
         const data = await storageService.getArticles();
         setArticles(data);
       } catch (error) {
         console.error("Failed to load dashboard data", error);
       } finally {
         setLoading(false);
       }
    };
    fetchStats();
  }, []);
  
  const stats = [
    { label: '文章总数', value: articles.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: '已发布', value: articles.filter(a => a.published).length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: '草稿', value: articles.filter(a => !a.published).length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: '总浏览量', value: articles.reduce((acc, curr) => acc + curr.views, 0), icon: Eye, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  if (loading) {
     return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600" /></div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">仪表盘概览</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         {stats.map((stat) => (
           <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center justify-between">
                 <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                 </div>
                 <div className={`p-3 rounded-full ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
         <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">最近文章</h2>
            <Link to="/admin/articles" className="text-sm font-medium text-blue-600 hover:text-blue-800">查看全部</Link>
         </div>
         <div className="divide-y divide-slate-100">
            {articles.slice(0, 5).map(article => (
               <div key={article.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                     <div className="h-12 w-12 rounded-lg bg-slate-200 overflow-hidden">
                        <img src={article.imageUrl} alt="" className="h-full w-full object-cover" />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-slate-900">{article.title}</h4>
                        <div className="flex items-center text-xs text-slate-500 mt-1">
                           <span className={`inline-block w-2 h-2 rounded-full mr-2 ${article.published ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                           {article.published ? '已发布' : '草稿'} • {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-medium text-slate-900">{article.views} 次浏览</p>
                     <Link to={`/admin/articles/edit/${article.id}`} className="text-xs text-blue-600 hover:underline">编辑</Link>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};
