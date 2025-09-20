"use client";

import { DiaryEntry } from "@/types";

interface DiaryListProps {
  entries: DiaryEntry[];
}

export default function DiaryList({ entries }: DiaryListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        まだ日記がありません
      </div>
    );
  }

  // 日記を年月ごとにグループ化
  const grouped = entries.reduce((acc, entry) => {
    const date = new Date(entry.date);
    const key = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {} as Record<string, DiaryEntry[]>);

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([month, monthEntries]) => (
        <div key={month}>
          {/* 月ごとのラベル */}
          <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium">
            {month}
          </div>

          {/* その月の日記一覧 */}
          <div className="space-y-4 mt-4">
            {monthEntries.map((entry) => {
              const day = new Date(entry.date).getDate();
              return (
                <div
                  key={entry.id}
                  className="bg-white shadow-sm rounded-md px-4 py-3 flex flex-col gap-2"
                >
                  {/* 日付・カテゴリ */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">
                      {day}日
                    </span>
                    <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {entry.category}
                    </span>
                  </div>

                  {/* タイトルと本文 */}
                  <div>
                    <h3 className="font-medium text-gray-900">{entry.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {entry.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
