import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// カテゴリのリストを定義しておく
//(あくまで応急処置です...)
const categories = [
  { id: "0", name: "日常" },
  { id: "1", name: "学習" },
  { id: "2", name: "観光" },
  { id: "3", name: "食事" },
  { id: "4", name: "友達" },
];

// IDからカテゴリ名を見つける関数
export const getCategoryNameById = (id:string) => {
  const category = categories.find(cat => cat.id === id);
  return category ? category.name : "不明"; // 見つからなかった場合は「不明」
};