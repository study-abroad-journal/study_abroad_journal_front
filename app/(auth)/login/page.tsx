"use client";

import { useState, useEffect } from 'react';
import AuthModal from '@/components/AuthModal';
import { User } from '@/types';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Welcome to Study Abroad Journal
          </h2>
          <p className="text-gray-500 mb-6">
            Start documenting your international experiences
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-emerald-400 to-blue-500 text-white px-6 py-2 rounded-lg hover:shadow-md transition-all"
          >
            Get Started
          </button>
        </div>
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          ログインしました：{user.name}
        </h2>
        <button
          onClick={handleLogout}
          className="bg-gray-300 px-6 py-2 rounded-lg"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}