// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";


export interface DiaryData {
  user_id: number;
  title: string;
  text: string;
  category_id?: number;
  latitude?: number;
  longitude?: number;
}

export interface DiaryResponse {
  diary_id: number;
  user_id: number;
  title: string;
  text: string;
  corrected_text: string;
  category_id: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

export const diaryAPI = {
  // 日記一覧取得
  getAll: async (): Promise<{ diaries: DiaryResponse[]; count: number }> => {
    const response = await fetch(`${API_BASE_URL}/api/diaries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch diaries: ${response.statusText}`);
    }

    return response.json();
  },

  // 特定の日記取得
  getById: async (id: number): Promise<DiaryResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/diary/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch diary: ${response.statusText}`);
    }

    return response.json();
  },

  // 日記作成
  create: async (diaryData: DiaryData): Promise<DiaryResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/diary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(diaryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create diary: ${response.statusText}`);
    }

    return response.json();
  },

  // 日記更新
  update: async (
    id: number,
    diaryData: Partial<DiaryData>
  ): Promise<DiaryResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/diary/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(diaryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update diary: ${response.statusText}`);
    }

    return response.json();
  },

  // 日記削除
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/diary/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete diary: ${response.statusText}`);
    }

    return response.json();
  },
};

