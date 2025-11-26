import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ArticleView } from './pages/ArticleView';
import { Login } from './pages/Login';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { ArticleManager } from './pages/admin/ArticleManager';
import { ArticleEditor } from './pages/admin/ArticleEditor';
import { AdminSettings } from './pages/admin/AdminSettings';

// Layout wrapper for public pages to include Navbar
const PublicLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <span className="text-white text-xl font-bold">Apex 工程解决方案</span>
          <p className="mt-4 text-sm leading-relaxed max-w-xs">
            致力于提供卓越的土木、结构和机械工程解决方案，共创可持续未来。
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">服务项目</h3>
          <ul className="space-y-2 text-sm">
            <li>基础设施</li>
            <li>能源系统</li>
            <li>工程咨询</li>
            <li>项目管理</li>
          </ul>
        </div>
        <div>
           <h3 className="text-white font-semibold mb-4">联系方式</h3>
           <ul className="space-y-2 text-sm">
             <li>info@apexengineering.com</li>
             <li>+1 (555) 123-4567</li>
             <li>创新城科技大道 101 号</li>
           </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
        &copy; {new Date().getFullYear()} Apex Engineering Solutions. 保留所有权利。
      </div>
    </footer>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<Home />} /> {/* Reuse Home for now, usually a list view */}
          <Route path="/article/:id" element={<ArticleView />} />
          <Route path="/about" element={<div className="p-20 text-center">关于我们页面占位符</div>} />
          <Route path="/projects" element={<div className="p-20 text-center">项目页面占位符</div>} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="articles" element={<ArticleManager />} />
          <Route path="articles/create" element={<ArticleEditor />} />
          <Route path="articles/edit/:id" element={<ArticleEditor />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;