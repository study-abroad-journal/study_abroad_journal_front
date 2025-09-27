"use client";

import { BookOpen, LogOut } from 'lucide-react';
import { User } from '@/types';

interface HeaderProps {
  user: User | null;
  activeTab: 'home' | 'diary' | 'calendar';
  setActiveTab: (tab: 'home' | 'diary' | 'calendar') => void;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Header({ user, activeTab, setActiveTab, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 py-2 sm:py-0">
          
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <BookOpen className="h-6 w-6 text-emerald-500" />
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 whitespace-nowrap">
              Study Abroad Journal
            </h1>
          </div>

          {/* Navigation Tabs */}
          {user && (
            <div className="flex overflow-x-auto space-x-4 sm:space-x-8 mb-2 sm:mb-0">
              <button
                onClick={() => setActiveTab('home')}
                className={`text-xs sm:text-sm font-medium pb-2 sm:pb-4 border-b-2 transition-colors ${
                  activeTab === 'home'
                    ? 'text-emerald-500 border-emerald-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                ホーム
              </button>
              <button
                onClick={() => setActiveTab('diary')}
                className={`text-xs sm:text-sm font-medium pb-2 sm:pb-4 border-b-2 transition-colors ${
                  activeTab === 'diary'
                    ? 'text-emerald-500 border-emerald-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                日記一覧
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`text-xs sm:text-sm font-medium pb-2 sm:pb-4 border-b-2 transition-colors ${
                  activeTab === 'calendar'
                    ? 'text-emerald-500 border-emerald-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                カレンダー
              </button>
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 text-xs sm:text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>ログアウト</span>
                </button>
              </>
            ) : (
              <button
                onClick={onLogin}
                className="bg-emerald-500 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-emerald-600 transition-colors"
              >
                ログイン
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
