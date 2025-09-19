"use client";

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { DiaryEntry,User } from '@/types';
import AuthModal from '@/components/AuthModal';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import DiaryForm from '@/components/DiaryForm';
import DiaryMap from '@/components/DiaryMap';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'diary' | 'calendar'>('home');
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  
  

  const openAuthModal = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };
  
  // ログイン
  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setShowAuthModal(false);
  };

  // ログアウト
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setActiveTab("diary"); // タブをリセット
  };

  function handleAddEntry(entry: Omit<DiaryEntry, 'id'>): void {
    throw new Error('Function not implemented.');
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header を全体に適用 */}
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogin={openAuthModal}
        onLogout={handleLogout}
      />
      {user ? (
        // ログイン後の簡単な確認画面。ここの部分にログイン後の画面を実装する
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">

              {/* 今後追加するコンポーネントのプレースホルダー */}
              <div className="space-y-6">
                <div className="rounded-lg p-8 text-center">
                  <DiaryForm onSubmit={handleAddEntry} />
                </div>

                {/* DiaryMap をフォームの下に配置 */}
                <div className="rounded-lg p-8 text-center">
                  <DiaryMap entries={diaryEntries} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // メインランディングページ
        <>

          {/* メインコンテンツ */}
          <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="text-center max-w-lg mx-auto px-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to Study Abroad Journal
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Start documenting your international experiences
              </p>
              
              <Button
                onClick={openAuthModal}
                className="bg-gradient-to-r from-emerald-400 to-blue-500 hover:from-emerald-500 hover:to-blue-600 text-white px-8 py-3 text-lg rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </Button>
            </div>
          </div>
        </>
      )}

      {showAuthModal && (
        <AuthModal 
          onClose={closeAuthModal}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}