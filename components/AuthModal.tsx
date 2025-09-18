"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import { User, AuthFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { auth } from './firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

export default function AuthModal({ onClose, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuthSuccess = (firebaseUser: FirebaseUser) => {
    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || formData.name || '',
    };
    onLogin(user); 
    
  };


  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setError(null);
  //   setLoading(true);

  //   try {
  //     if (isLogin) {
  //       // --- ログイン処理 ---
  //       const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
  //       handleAuthSuccess(userCredential.user);
  //     } else {
  //       // --- サインアップ処理 ---
  //       const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
  //       // ユーザープロファイルに名前を更新
  //       if (auth.currentUser) {
  //           await updateProfile(auth.currentUser, {
  //               displayName: formData.name,
  //           });

  //           //以下、この部分にバックエンドにuserの情報を送るコードを書く

  //           //↓firebaseのIDを取得するコード
  //           //const idToken = await auth.currentUser.getIdToken();

  //       }
  //       handleAuthSuccess(userCredential.user);
  //     }
      
  //   } catch (err: any) {
  //     console.error("認証エラー:", err.message);
  //     setError(getFirebaseErrorMessage(err.code));
  //   } finally {
  //       setLoading(false);
  //   }
  // };

  // ここから後で削除
  // AuthModal.tsx 内の handleSubmit を差し替え（モックモード）
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // --- モックユーザー ---
      const mockUser: User = {
        id: "mock-123",
        email: formData.email || "test@example.com",
        name: formData.name || "テストユーザー",
      };

      onLogin(mockUser);
      onClose(); // モーダル閉じる

    } catch (err: any) {
      console.error("モック認証エラー:", err.message);
      setError("モックログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };
// ここまで後で削除

  // Firebaseのエラーコードを日本語メッセージに変換するヘルパー関数
  const getFirebaseErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/invalid-email': return '無効なメールアドレスです。';
      case 'auth/user-not-found': return 'このアカウントは見つかりませんでした。';
      case 'auth/wrong-password': return 'パスワードが間違っています。';
      case 'auth/email-already-in-use': return 'このメールアドレスは既に使用されています。';
      case 'auth/weak-password': return 'パスワードは6文字以上で設定してください。';
      default: return '認証に失敗しました。もう一度お試しください。';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'ログイン' : 'サインアップ'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                名前
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name || ''}
                onChange={handleInputChange}
                required={!isLogin}
                placeholder="あなたの名前"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              メールアドレス
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="example@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              パスワード
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="パスワード"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 hover:from-emerald-500 hover:to-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {loading ? '処理中...' : (isLogin ? 'ログイン' : 'サインアップ')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-emerald-500 hover:text-emerald-600 transition-colors font-medium"
          >
            {isLogin ? 'アカウントをお持ちでない方はこちら' : 'すでにアカウントをお持ちの方はこちら'}
          </button>
        </div>
      </div>
    </div>
  );
}