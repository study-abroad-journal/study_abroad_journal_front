"use client";

import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { DiaryEntry, User } from "@/types";
import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import DiaryForm from "@/components/DiaryForm";
import DiaryMap from "@/components/DiaryMap";
import DiaryList from "@/components/DiaryList";
import { diaryAPI, DiaryResponse } from "@/lib/api";

const convertApiResponseToEntry = (response: DiaryResponse): DiaryEntry => ({
  id: response.diary_id.toString(),
  title: response.title,
  content: response.text,
  date: new Date(response.created_at).toISOString().split("T")[0],
  location: {
    latitude: response.latitude,
    longitude: response.longitude,
    address: `緯度: ${response.latitude}, 経度: ${response.longitude}`,
  },
  category: response.category_id.toString(),
  createdAt: response.created_at,
  updatedAt: response.created_at,
});

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [activeTab, setActiveTab] = useState<"home" | "diary" | "calendar">(
    "home"
  );
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAuthModal = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  // ログイン
  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  // ログアウト
  const handleLogout = () => {
    setUser(null);
    setActiveTab("diary"); // タブをリセット
  };

  const loadDiaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await diaryAPI.getAll();
      //const entries = response.diaries.map(convertApiResponseToEntry);
      //setDiaryEntries(entries);
      //setDiaryEntries(response.diaries || []);
      if (response.diaries && Array.isArray(response.diaries)) {
        const entries = response.diaries.map(convertApiResponseToEntry);
        setDiaryEntries(entries);
      } else {
        setDiaryEntries([]);
      }
    } catch (err) {
      console.error("Failed to load diaries:", err);
      setError("日記の読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDiaries();
    }
  }, [user]);

  const handleAddEntry = async (entry: Omit<DiaryEntry, "id">) => {
    try {
      setLoading(true);
      setError(null);

      const apiData = {
        user_id: 1,
        title: entry.title,
        text: entry.content,
        category_id: parseInt(entry.category) || 1,
        latitude: entry.location?.latitude || 0,
        longitude: entry.location?.longitude || 0,
      };

      const response = await diaryAPI.create(apiData);
      const newEntry = convertApiResponseToEntry(response);
      setDiaryEntries((prev) => [newEntry, ...prev]);
    } catch (err) {
      console.error("Failed to create diary:", err);
      setError("日記の作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

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
        // ログイン後の画面
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {activeTab === "home" && (
                <div className="space-y-6">
                  {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}

                  {/* ここにローディング表示を追加 */}
                  {loading && (
                    <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                      処理中...
                    </div>
                  )}
                  {/* 入力フォーム */}
                  <div className="rounded-lg p-8 text-center">
                    <DiaryForm onSubmit={handleAddEntry} />
                  </div>

                  {/* 地図 */}
                  <div className="rounded-lg p-8 text-center">
                    <DiaryMap entries={diaryEntries} />
                  </div>

                  {/* 日記がない場合のメッセージ */}
                  {diaryEntries.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                      まだ日記がありません。上のフォームから最初の日記を作成してみましょう！
                    </div>
                  )}
                </div>
              )}

              {activeTab === "diary" && (
                <DiaryList
                  entries={diaryEntries}
                  onUpdate={(updatedEntry) => {
                    setDiaryEntries((prevEntries) =>
                      prevEntries.map((entry) =>
                        entry.id === updatedEntry.id ? updatedEntry : entry
                      )
                    );
                  }}
                />
              )}

              {/* {activeTab === "calendar" && (
                <DiaryCalendar entries={diaryEntries} fullScreen />
              )} */}
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
        <AuthModal onClose={closeAuthModal} onLogin={handleLogin} />
      )}
    </div>
  );
}
