"use client";

import { DiaryEntry } from "@/types";
import { useState } from "react";
import DiaryModal from "./DiaryModal";

interface DiaryListProps {
  entries: DiaryEntry[];
  onUpdate: (updated: DiaryEntry) => void; // 更新後に親の state を更新する
}

export default function DiaryList({ entries, onUpdate }: DiaryListProps) {
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">まだ日記がありません</div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        // 200字まで表示、超えたら「...」
        const previewContent =
          entry.content.length > 200
            ? entry.content.substring(0, 200) + "..."
            : entry.content;

        return (
          <div
            key={entry.id}
            className="bg-white shadow-sm rounded-md px-4 py-3 cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedEntry(entry)}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-800">
                {new Date(entry.date).getDate()}日
              </span>
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {entry.category}
              </span>
            </div>
            <h3 className="font-medium text-gray-900">{entry.title}</h3>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
              {previewContent}
            </p>
          </div>
        );
      })}

      {/* モーダル */}
      {selectedEntry && (
        <DiaryModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
