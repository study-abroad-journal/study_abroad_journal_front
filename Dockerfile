# Node.js ベースイメージ
FROM node:18-alpine

WORKDIR /front

# 依存関係をコピーしてインストール
COPY package*.json ./
RUN npm install

# ソースコードコピー
COPY . .

# Next.js 開発サーバを起動
CMD ["npm", "run", "dev"]
