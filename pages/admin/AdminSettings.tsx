import React, { useState } from 'react';
import { storageService } from '../../services/storage';
import { Lock, Save, CheckCircle, Loader2 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    if (passwords.new !== passwords.confirm) {
      setStatus({ type: 'error', message: '新密码不匹配。' });
      return;
    }

    if (passwords.new.length < 4) {
      setStatus({ type: 'error', message: '密码至少包含4个字符。' });
      return;
    }

    setLoading(true);
    try {
      const success = await storageService.changePassword(passwords.current, passwords.new);
      if (success) {
        setStatus({ type: 'success', message: '密码更新成功。' });
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        setStatus({ type: 'error', message: '当前密码错误。' });
      }
    } catch (e) {
      setStatus({ type: 'error', message: '网络错误，请稍后重试。' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
       <h1 className="text-3xl font-bold text-slate-900 mb-8">账户设置</h1>
       
       <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center mb-6">
             <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Lock className="w-6 h-6 text-blue-600" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-900">修改密码</h2>
                <p className="text-sm text-slate-500">更新您的管理员访问凭证。</p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
             {status.message && (
                <div className={`p-4 rounded-md flex items-center ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                   {status.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
                   {status.message}
                </div>
             )}

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">当前密码</label>
                <input 
                  type="password" 
                  name="current"
                  value={passwords.current}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">新密码</label>
                  <input 
                    type="password" 
                    name="new"
                    value={passwords.new}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">确认新密码</label>
                  <input 
                    type="password" 
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
             </div>

             <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 transition-colors disabled:opacity-70"
                >
                   {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                   更新密码
                </button>
             </div>
          </form>
       </div>
    </div>
  );
};
