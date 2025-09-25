import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  
  try {
    // フロントエンドから送信されたJSONボディから text を取り出す
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // AIに送信する指示（プロンプト）
    const prompt = `
      あなたは優秀な多言語の文法・スタイル添削者です。
      与えられたテキストを添削し、フィードバックを提供してください。フィードバックを与える相手はその言語を学習している途上の人であることを想定し、その人の学習レベルはテキストから見極めてください。
      レスポンスは必ず単一のJSONオブジェクトで、以下の2つのキーを持つ形式で返してください。
      1. "correctedText": 元の言語のまま、完全に添削されたテキスト文字列。
      2. "feedback": 日本語で、改善点を簡潔にまとめた箇条書きの文字列。

      このJSONオブジェクト以外には、何も含めないでください。

      添削するテキスト:
      "${text}"
    `;

    // OpenAI APIを呼び出す
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 高速でコスト効率の良いモデル
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, // 必ずJSON形式で返却させる
    });

    const result = response.choices[0].message.content;

    if (!result) {
      throw new Error("No response content from OpenAI.");
    }

    return NextResponse.json(JSON.parse(result));

  } catch (error) {
    // エラーが発生した場合は、サーバーのログにエラー内容を出力
    console.error("Error in AI correction API:", error);
    // フロントエンドには汎用的なエラーメッセージを返す
    return NextResponse.json(
      { error: "Failed to get AI correction." },
      { status: 500 }
    );
  }
}