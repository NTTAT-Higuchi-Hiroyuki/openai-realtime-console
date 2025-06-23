# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
このプロジェクトの従事者は日本語を主要なコミュニケーション言語として使用します。全てのドキュメント、コードコメント、コミットメッセージ、Github Issue、Pull Requestは日本語で記述されます。

## プロジェクト概要

OpenAI Realtime API と WebRTC を使用したリアルタイム音声対話コンソールアプリケーション。React フロントエンドと Express サーバーを使用した SSR 構成。

## 開発コマンド

### 基本コマンド
```bash
npm install          # 依存関係のインストール
npm run dev          # 開発サーバー起動（ポート3000）
npm start            # 本番サーバー起動
npm run lint         # ESLint によるコード検証・修正
```

### ビルドコマンド
```bash
npm run build        # クライアント・サーバー両方をビルド
npm run build:client # クライアントのみビルド（dist/client）
npm run build:server # サーバーのみビルド（dist/server）
```

## アーキテクチャ

### フロントエンド（/client）
- **React** + **Vite** による SPA 構成
- **Tailwind CSS** でスタイリング
- **WebRTC** による OpenAI Realtime API との直接通信
- SSR 対応（entry-server.jsx / entry-client.jsx）

### バックエンド（server.js）
- **Express** サーバー
- **Vite middleware** による開発時の React サーブ
- `/token` エンドポイントで OpenAI セッショントークン生成
- SSR レンダリング処理

### 主要コンポーネント
- **App.jsx**: メインアプリケーション、WebRTC セッション管理
- **SessionControls.jsx**: セッション開始/停止、メッセージ送信UI
- **EventLog.jsx**: リアルタイムイベントログ表示
- **ToolPanel.jsx**: 関数呼び出し設定パネル

### WebRTC フロー
1. `/token` でエフェメラルキー取得
2. RTCPeerConnection 作成、マイク音声トラック追加
3. Data Channel でイベント送受信
4. OpenAI Realtime API と SDP 交換でセッション確立

## 環境設定

`.env` ファイルに `OPENAI_API_KEY` を設定する必要があります。

## important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.