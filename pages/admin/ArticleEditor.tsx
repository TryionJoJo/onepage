import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storage';
import { geminiService } from '../../services/gemini';
import { Article } from '../../types';
import { Save, ArrowLeft, Wand2, Loader2, Sparkles, Tag } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const ArticleEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = storageService.getCurrentUser();
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [tagInput, setTagInput] = useState('');
  
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    category: '通用',
    summary: '',
    content: '',
    imageUrl: `https://picsum.photos/seed/${Math.random()}/800/600`,
    published: false,
    tags: []
  });

  useEffect(() => {
    const fetchArticle = async () => {
      if (id) {
        setInitialLoading(true);
        try {
          const article = await storageService.getArticleById(id);
          if (article) {
            setFormData(article);
            setTagInput(article.tags ? article.tags.join(', ') : '');
          }
        } catch (e) {
          console.error(e);
        } finally {
          setInitialLoading(false);
        }
      }
    };
    fetchArticle();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTogglePublish = () => {
    setFormData(prev => ({ ...prev, published: !prev.published }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    
    setLoading(true);
    
    const processedTags = tagInput.split(',').map(t => t.trim()).filter(t => t.length > 0);

    const articleToSave: Article = {
      ...formData,
      id: id || uuidv4(),
      authorId: user?.id || 'unknown',
      authorName: user?.username || '管理员',
      createdAt: formData.createdAt || Date.now(),
      views: formData.views || 0,
      tags: processedTags
    } as Article;

    await storageService.saveArticle(articleToSave);
    setLoading(false);
    navigate('/admin/articles');
  };

  const handleAIGenerate = async () => {
     if (!formData.title) {
       alert("请先输入标题/主题。");
       return;
     }

     setAiLoading(true);
     try {
       const result = await geminiService.generateDraft(formData.title);
       setFormData(prev => ({
         ...prev,
         summary: result.summary,
         content: result.content
       }));
     } catch (error) {
       alert("生成内容失败，请检查 API Key 配置。");
       console.error(error);
     } finally {
       setAiLoading(false);
     }
  };

  if (initialLoading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate('/admin/articles')} className="text-slate-500 hover:text-slate-800 flex items-center transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> 返回
        </button>
        <h1 className="text-2xl font-bold text-slate-900">{id ? '编辑文章' : '新建文章'}</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
           
           {/* Title & Category */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3">
                 <label className="block text-sm font-medium text-slate-700 mb-1">文章标题 / 主题</label>
                 <div className="relative">
                   <input 
                     type="text" 
                     name="title"
                     value={formData.title} 
                     onChange={handleChange}
                     className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                     placeholder="例如：抗震区域的创新桥梁设计"
                     required
                   />
                   <button 
                     type="button"
                     onClick={handleAIGenerate}
                     disabled={aiLoading || !formData.title}
                     className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center hover:opacity-90 disabled:opacity-50 transition-opacity"
                     title="使用 Gemini AI 自动生成草稿"
                   >
                     {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4 mr-1" /> AI 起草</>}
                   </button>
                 </div>
                 <p className="text-xs text-slate-400 mt-2">提示：输入技术主题并点击“AI 起草”以生成内容。</p>
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-slate-700 mb-1">分类</label>
                 <select 
                   name="category" 
                   value={formData.category} 
                   onChange={handleChange}
                   className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                 >
                   <option value="通用">通用</option>
                   <option value="基础设施">基础设施</option>
                   <option value="可持续发展">可持续发展</option>
                   <option value="技术">技术</option>
                   <option value="企业动态">企业动态</option>
                   <option value="工程咨询">工程咨询</option>
                 </select>
              </div>
           </div>

           {/* Tags */}
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">标签 (逗号分隔)</label>
              <div className="relative">
                 <Tag className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                 <input 
                   type="text" 
                   value={tagInput}
                   onChange={(e) => setTagInput(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                   placeholder="例如：土木工程, 设计, 项目更新"
                 />
              </div>
           </div>

           {/* Image URL */}
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">封面图片 URL</label>
              <input 
                 type="text" 
                 name="imageUrl"
                 value={formData.imageUrl} 
                 onChange={handleChange}
                 className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                 placeholder="https://..."
              />
              {formData.imageUrl && (
                 <div className="mt-4 h-48 w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <img src={formData.imageUrl} alt="预览" className="w-full h-full object-cover" />
                 </div>
              )}
           </div>

           {/* Summary */}
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">摘要 (Meta 描述)</label>
              <textarea 
                 name="summary"
                 value={formData.summary} 
                 onChange={handleChange}
                 rows={2}
                 className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                 placeholder="文章简要概述..."
              />
           </div>

           {/* Content */}
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">完整内容</label>
              <textarea 
                 name="content"
                 value={formData.content} 
                 onChange={handleChange}
                 rows={15}
                 className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm leading-relaxed"
                 placeholder="在此撰写您的文章内容..."
              />
           </div>

           {/* Publish Status */}
           <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div className="flex items-center">
                 <button 
                   type="button" 
                   onClick={handleTogglePublish}
                   className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.published ? 'bg-blue-600' : 'bg-slate-200'}`}
                 >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.published ? 'translate-x-5' : 'translate-x-0'}`} />
                 </button>
                 <span className="ml-3 text-sm font-medium text-slate-700">{formData.published ? '已发布' : '草稿模式'}</span>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all"
              >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                 保存文章
              </button>
           </div>
        </div>
      </form>
    </div>
  );
};
