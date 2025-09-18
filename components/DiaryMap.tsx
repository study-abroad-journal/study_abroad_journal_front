"use client";

import { MapPin, Calendar } from 'lucide-react';
import { DiaryEntry } from '@/types';

interface DiaryMapProps {
  entries: DiaryEntry[];
}

export default function DiaryMap({ entries }: DiaryMapProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-400 to-blue-500 p-4 text-white">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <h2 className="text-lg font-medium">Diary Locations</h2>
        </div>
        <p className="text-emerald-100 text-sm mt-1">
          {entries.length} entries recorded
        </p>
      </div>
      
      <div className="h-64 bg-gray-100 relative flex items-center justify-center">
        {entries.length === 0 ? (
          <div className="text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">地図に表示する日記がありません</p>
            <p className="text-xs text-gray-400">位置情報付きの日記を投稿してください</p>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-emerald-400" />
            <p className="text-sm">地図機能は開発中です</p>
            <p className="text-xs text-gray-400">{entries.length}件の日記があります</p>
          </div>
        )}
      </div>
    </div>
  );
}