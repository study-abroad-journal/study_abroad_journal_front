"use client";

import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { DiaryEntry, User } from "@/types";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import DiaryForm from "@/components/DiaryForm";
import DiaryMap from "@/components/DiaryMap";
import { diaryAPI, DiaryResponse } from "@/lib/api";

// 追加1: データ変換関数
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
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const openAuthModal = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  // 日記読み込み関数
  const loadDiaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await diaryAPI.getAll();
      const entries = response.diaries.map(convertApiResponseToEntry);
      setDiaryEntries(entries);
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

  //今は localStorage.setItem に保存しているので、後でバックエンドとつなげるときに差し替え
  // const handleAddEntry = (entry: Omit<DiaryEntry, "id">) => {
  //   const newEntry: DiaryEntry = {
  //     ...entry,
  //     id: Date.now().toString(),
  //   };
  //   const updatedEntries = [newEntry, ...diaryEntries];
  //   setDiaryEntries(updatedEntries);
  //   localStorage.setItem("diaryEntries", JSON.stringify(updatedEntries));
  // };

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

  // function handleSubmit(entry: Omit<DiaryEntry, "id">): void {
  //   throw new Error("Function not implemented.");
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        // ログイン後の簡単な確認画面。ここの部分にログイン後の画面を実装する
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome Back, {user.name}!
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Ready to continue your journey?
                  </p>
                </div>
                <button
                  onClick={() => setUser(null)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  ログアウト
                </button>
              </div>

              {/* ここにエラー表示を追加 */}
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

              {/* 今後追加するコンポーネントのプレースホルダー */}
              <div className="space-y-6">
                <div className="rounded-lg p-8 text-center">
                  <DiaryForm onSubmit={handleAddEntry} />
                </div>

                {/* DiaryMap をフォームの下に配置 */}
                <div className="rounded-lg p-8 text-center">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">
                      あなたの日記 ({diaryEntries.length}件)
                    </h2>
                    <button
                      onClick={loadDiaries}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      disabled={loading}
                    >
                      {loading ? "読み込み中..." : "更新"}
                    </button>
                  </div>
                  <DiaryMap entries={diaryEntries} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // メインランディングページ
        <>
          {/* ヘッダー部分（簡素化） */}
          <div className="flex justify-between items-center p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-emerald-500" />
              <h1 className="text-xl font-semibold text-gray-800">
                Study Abroad Journal
              </h1>
            </div>
            <Button
              onClick={openAuthModal}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-600 transition-colors"
            >
              ログイン
            </Button>
          </div>

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
