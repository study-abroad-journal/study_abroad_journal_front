"use client";

import { useState } from "react";
import { DiaryEntry } from "@/types";
import { Pencil } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface DiaryModalProps {
  entry: DiaryEntry;
  onClose: () => void;
  onUpdate: (updated: DiaryEntry) => void; // 親に変更を伝える
}

import { getCategoryNameById } from "@/lib/utils";

export default function DiaryModal({ entry, onClose, onUpdate }: DiaryModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: entry.title,
    category: entry.category,
    content: entry.content,
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: バックエンドAPIにPUT or PATCHリクエストを送る
      // 例: fetch(`/api/diary/${entry.id}`, { method: "PUT", body: JSON.stringify(form) })
      const updatedEntry: DiaryEntry = {
        ...entry,
        ...form,
        updatedAt: new Date().toISOString(),
      };

      // ダミー: 実際は API のレスポンスを使う
      await new Promise((res) => setTimeout(res, 500));

      onUpdate(updatedEntry); // 親の state を更新
      setIsEditing(false);
      onClose(); // モーダルを閉じる
    } catch (error) {
      console.error("更新失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {!isEditing ? (
          <>
            {/* 詳細表示 */}
            <h2 className="text-xl font-bold mb-2">{entry.title}</h2>
            <p className="text-sm text-gray-500 mb-1">{getCategoryNameById(entry.category)}</p>
            <p className="text-gray-700 whitespace-pre-line">{entry.content}</p>

            {/* 編集ボタン */}
            <button
              onClick={() => setIsEditing(true)}
              className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow hover:bg-blue-700"
            >
              <Pencil size={20} />
            </button>
          </>
        ) : (
          <>
            {/* 編集フォーム */}
            <div className="space-y-3">
              {/* タイトル */}
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="タイトル"
              />
              {/* カテゴリ */}
              <div className="flex items-center space-x-4">
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    setForm({ ...form, category: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="カテゴリ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="日常">日常</SelectItem>
                    <SelectItem value="学習">学習</SelectItem>
                    <SelectItem value="観光">観光</SelectItem>
                    <SelectItem value="食事">食事</SelectItem>
                    <SelectItem value="友達">友達</SelectItem>
                  </SelectContent>
                </Select>

                {/* カテゴリ追加ボタン (まだ未実装) */}
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                  <span className="text-xl">+</span>
                </div>
              </div>

              {/* 本文 */}
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full border rounded px-3 py-2 h-40"
                placeholder="本文"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "保存中..." : "保存"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
