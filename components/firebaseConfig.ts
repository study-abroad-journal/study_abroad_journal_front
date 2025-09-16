// components/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// あなた自身のFirebaseプロジェクトの設定情報に書き換えてください
const firebaseConfig = {
  apiKey: "AIzaSyA0c-EXGpJJErUg18imP5d96-xdLWlWR6g",
  authDomain: "study-abroad-journal.firebaseapp.com",
  projectId: "study-abroad-journal",
  storageBucket: "study-abroad-journal.firebasestorage.app",
  messagingSenderId: "50440133838",
  appId: "1:50440133838:web:31d3df64e4b410bdcc849f",
  measurementId: "G-KVW8FEDZKF"
};

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// Firebase Authenticationのインスタンスを取得してエクスポート
export const auth = getAuth(app);