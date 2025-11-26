import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { Article } from '../../types';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, Loader2 } from 'lucide-react';

export const ArticleManager: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const refreshArticles = async () => {
    setLoading(true);
    try {
      const data = await storageService.getArticles();
      setArticles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      await storageService.deleteArticle(id);
      refreshArticles();
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-900">文章列表</h1>
        <Link to="/admin/articles/create" className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm font-medium">
          <Plus className="w-4 h-4 mr-2" /> 新建文章
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center bg-slate-50/50">
           <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="搜索文章..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">标题</th>
                <th className="px-6 py-4 font-semibold">分类</th>
                <th className="px-6 py-4 font-semibold">状态</th>
                <th className="px-6 py-4 font-semibold">日期</th>
                <th className="px-6 py-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArticles.map(article => (
                <tr key={article.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                       <img src={article.imageUrl} alt="" className="w-10 h-10 rounded object-cover bg-slate-200" />
                       <span className="font-medium text-slate-800 line-clamp-1 max-w-xs">{article.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      article.published ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {article.published ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                       <Link to={`/article/${article.id}`} target="_blank" className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="查看">
                         <Eye className="w-4 h-4" />
                       </Link>
                       <Link to={`/admin/articles/edit/${article.id}`} className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="编辑">
                         <Edit2 className="w-4 h-4" />
                       </Link>
                       <button onClick={() => handleDelete(article.id)} className="p-1 text-slate-400 hover:text-red-600 transition-colors" title="删除">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredArticles.length === 0 && (
                 <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                       暂无文章。
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
};
