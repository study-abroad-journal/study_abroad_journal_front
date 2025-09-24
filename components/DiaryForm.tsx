"use client";

import { useState } from "react";
import { MapPin, Mic, Camera, Calendar } from "lucide-react";
import { DiaryEntry } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DiaryFormProps {
  onSubmit: (entry: Omit<DiaryEntry, "id">) => void;
  onLocationUpdate?: (location: [number, number] | null) => void;
  currentLocation?: [number, number] | null;
}

export default function DiaryForm({
  onSubmit,
  onLocationUpdate,
}: DiaryFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    category: "日常",
  });
  const [showAiCorrection, setShowAiCorrection] = useState(false);
  const [aiCorrection, setAiCorrection] = useState("");
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [locationError, setLocationError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry: Omit<DiaryEntry, "id"> = {
      ...formData,
      location: currentLocation ? {
        latitude: currentLocation[0],
        longitude: currentLocation[1],
        address: `緯度: ${currentLocation[0].toFixed(6)}, 経度: ${currentLocation[1].toFixed(6)}`
      } : undefined,
      aiCorrection: aiCorrection || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(entry);

    // Reset form
    setFormData({
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
      category: "日常",
    });
    setShowAiCorrection(false);
    setAiCorrection("");
    setCurrentLocation(null);
    onLocationUpdate?.(null);
  };

  const handleAiCorrection = () => {
    // Mock AI correction
    setAiCorrection(
      `AI Correction: "${formData.content}"\n\nSuggested improvements:\n- Consider using more specific adjectives\n- Grammar looks good!\n- Try adding more descriptive details about your experience.`
    );
    setShowAiCorrection(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Camera className="h-5 w-5 text-emerald-500" />
        <h2 className="text-lg font-medium text-gray-800">
          Write Your Daily Experience
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="タイトル"
              required
              className="text-base"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
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

        <div>
          <Textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="今日の体験を書いてください..."
            rows={8}
            required
            className="text-base resize-none"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              console.log("位置情報取得開始");
              setLocationError("");

              if (navigator.geolocation) {
                console.log("if突入")
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    console.log("position突入")
                    const location: [number, number] = [
                      position.coords.latitude,
                      position.
                      coords.longitude,
                    ];
                    console.log("getcurrentposition突入")
                    setCurrentLocation(location);
                    onLocationUpdate?.(location);
                    console.log("現在地を取得:", location);
                  },
                  (error) => {
                    console.log("エラー:", error.message);
                    setLocationError("位置情報の取得に失敗しました");
                  },
                  {
                    maximumAge: 0,
                    enableHighAccuracy: true,
                  }
                );
              } else {
                console.log("位置情報がサポートされていません");
              }
            }}
            className="flex items-center space-x-2 bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
          >
            <MapPin className="h-4 w-4" />
            <span>位置情報取得</span>
          </Button>
        </div>
        {locationError && (
          <div className="text-red-600 text-sm mt-2">{locationError}</div>
        )}

        {currentLocation && (
          <div className="text-green-600 text-sm mt-2">
            現在地: 緯度 {currentLocation[0].toFixed(6)}, 経度{" "}
            {currentLocation[1].toFixed(6)}
          </div>
        )}

        {showAiCorrection && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">
              AI Correction Results
            </h3>
            <div className="text-sm text-blue-700 whitespace-pre-line">
              {aiCorrection}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button
            type="button"
            onClick={handleAiCorrection}
            disabled={!formData.content.trim()}
            className="w-full bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white"
          >
            Submit for AI Correction
          </Button>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 hover:from-emerald-500 hover:to-blue-600 text-white"
          >
            投稿する
          </Button>
        </div>
      </form>
    </div>
  );
}
