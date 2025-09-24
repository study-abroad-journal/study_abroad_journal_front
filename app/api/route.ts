import { NextResponse } from "next/server";
import { OpenAI } from "openai";

/**
 * OpenAIクライアントの初期化
 * APIキーは .env.local ファイルから自動的に読み込まれます。
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POSTリクエストを処理するAPIエンドポイント
 * フロントエンドからの添削リクエストを受け付けます。
 */
export async function POST(request: Request) {
  // サーバー側のターミナルにログを出力して、リクエストが届いたことを確認
  console.log("AI correction API was called.");

  try {
    // フロントエンドから送信されたJSONボディから text を取り出す
    const { text } = await request.json();

    // text が空の場合はエラーを返す
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // AIに送信する指示（プロンプト）
    const prompt = `
      You are an expert English grammar and style corrector.
      Your task is to correct the given text and provide feedback.
      Please return your response as a single JSON object with two keys:
      1. "correctedText": A string containing the fully corrected version of the text.
      2. "feedback": A string containing a brief, bulleted list of the key improvements.

      Do not include any text outside of the JSON object.

      The text to correct is:
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

    // OpenAIからのレスポンス(文字列)をJSONとしてパースしてフロントに返す
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