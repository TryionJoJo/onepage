import { Article, User } from '../types';

const STORAGE_KEYS = {
  USER: 'apex_user_session',
};

/**
 * API 存储服务
 * 直接连接到 Cloudflare Pages Functions API (/api/...)。
 * 不再使用 LocalStorage 作为后备。
 */
export const storageService = {
  
  // ----------------------------------------------------------------------
  // Articles
  // ----------------------------------------------------------------------

  getArticles: async (): Promise<Article[]> => {
    try {
      const response = await fetch('/api/articles');
      if (response.ok) {
        return await response.json();
      }
      console.error('Failed to fetch articles:', response.statusText);
      return [];
    } catch (error) {
      console.error('Network error fetching articles:', error);
      return [];
    }
  },

  getPublicArticles: async (): Promise<Article[]> => {
    const articles = await storageService.getArticles();
    return articles.filter(a => a.published).sort((a, b) => b.createdAt - a.createdAt);
  },

  getArticleById: async (id: string): Promise<Article | undefined> => {
    // 目前 API 尚未提供单个获取接口，暂时获取所有后在前端筛选
    // 如果文章数量巨大，建议后续增加 GET /api/articles/:id 接口
    const articles = await storageService.getArticles();
    return articles.find(a => a.id === id);
  },

  saveArticle: async (article: Article): Promise<void> => {
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save article');
    }
  },

  deleteArticle: async (id: string): Promise<void> => {
    const response = await fetch(`/api/articles/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete article');
    }
  },

  // ----------------------------------------------------------------------
  // Authentication
  // ----------------------------------------------------------------------

  login: async (username: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const user = await response.json();
        // 保持会话在客户端 (关闭浏览器即失效)
        sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      return response.ok;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  },

  logout: () => {
    sessionStorage.removeItem(STORAGE_KEYS.USER);
  },

  getCurrentUser: (): User | null => {
    const stored = sessionStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  }
};