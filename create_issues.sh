#!/bin/bash

# OpenAI Realtime Console プロジェクトの改善タスク用GitHub Issue作成スクリプト
# 実行前に 'gh auth login' でGitHub認証を完了してください

echo "Creating GitHub Issues for OpenAI Realtime Console improvements..."

# Issue 1: セキュリティ強化とAPIキー保護の改善
gh issue create \
  --title "Task: セキュリティ強化とAPIキー保護の改善" \
  --label "task,security,high-priority" \
  --body "## タスクのゴール

OpenAI Realtime Console アプリケーションのセキュリティを強化し、APIキーの適切な保護、入力検証、レート制限を実装することで、セキュリティ脆弱性を解消する。

## 子タスクリスト

- [ ] サーバーサイドでのAPIキー存在確認とプロセス終了処理の実装 (～12/25)

- [ ] CORS設定の追加（適切なオリジン制限とクレデンシャル設定） (～12/25)

- [ ] レート制限の実装（/tokenエンドポイントへの過度なアクセス防止） (～12/26)

- [ ] クライアントサイドでの入力検証とサニタイゼーション（XSS対策） (～12/26)

- [ ] セキュリティ設定のテスト実装 (～12/27)

## 詳細

### 現在の問題点
- server.jsでAPIキーの検証が不十分
- CORS設定がなく、任意のオリジンからのアクセスが可能  
- レート制限がないため、DoS攻撃のリスク
- クライアントサイドでの入力検証不足によるXSSの可能性

### 実装内容
1. **APIキー保護強化**
   \`\`\`javascript
   if (!apiKey) {
     console.error('OPENAI_API_KEY is required');
     process.exit(1);
   }
   \`\`\`

2. **CORS設定**
   \`\`\`javascript
   app.use(cors({
     origin: process.env.CLIENT_URL || 'http://localhost:3000',
     credentials: true
   }));
   \`\`\`

3. **レート制限**
   \`\`\`javascript
   app.use('/token', rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 10
   }));
   \`\`\`

### 優先度: 高
### 複雑さ: 低〜中

### 関連ファイル
- server.js
- client/components/SessionControls.jsx
- package.json (依存関係追加)"

echo "Issue 1 created: セキュリティ強化とAPIキー保護の改善"

# Issue 2: エラーハンドリングとWebRTCリソース管理の改善
gh issue create \
  --title "Task: エラーハンドリングとWebRTCリソース管理の改善" \
  --label "task,reliability,high-priority" \
  --body "## タスクのゴール

App.jsxにおけるWebRTCセッション管理のエラーハンドリングを強化し、適切なリソースクリーンアップを実装することで、アプリケーションの安定性と信頼性を向上させる。

## 子タスクリスト

- [ ] startSession関数への包括的なtry-catch処理の追加 (～12/26)

- [ ] メディアストリームとWebRTCリソースの適切なクリーンアップ実装 (～12/27)

- [ ] 接続状態の監視とエラー状態からの回復機能 (～12/28)

- [ ] ユーザーフィードバック用のエラー通知システム (～12/28)

- [ ] stopSession関数の堅牢なnullチェックと例外処理 (～12/26)

## 詳細

### 現在の問題点
- startSession()でエラーハンドリングが不十分
- メディアストリームやRTCPeerConnectionのリソースリーク
- エラー発生時のユーザーへのフィードバック不足
- stopSession()でのnullチェックが不完全

### 実装内容
1. **startSession改善**
   \`\`\`javascript
   async function startSession() {
     try {
       const tokenResponse = await fetch(\"/token\");
       if (!tokenResponse.ok) {
         throw new Error(\`Token fetch failed: \${tokenResponse.status}\`);
       }
       // ... 既存のロジック
     } catch (error) {
       console.error('Session start failed:', error);
       setIsSessionActive(false);
       // エラー状態のクリーンアップ
       cleanup();
       // ユーザーへの通知
     }
   }
   \`\`\`

2. **リソース管理**
   - MediaStreamTrackの適切な停止
   - RTCPeerConnectionの確実なクローズ
   - イベントリスナーの削除

3. **エラー状態管理**
   - エラー状態のstate管理
   - 再試行機能の実装

### 優先度: 高
### 複雑さ: 中

### 関連ファイル
- client/components/App.jsx
- client/components/SessionControls.jsx"

echo "Issue 2 created: エラーハンドリングとWebRTCリソース管理の改善"

# Issue 3: テストフレームワーク導入と品質保証体制構築
gh issue create \
  --title "Task: テストフレームワーク導入と品質保証体制構築" \
  --label "task,testing,quality,high-priority" \
  --body "## タスクのゴール

OpenAI Realtime Console プロジェクトにテストフレームワークを導入し、ユニットテスト、統合テスト、E2Eテストの実装により品質保証体制を構築する。

## 子タスクリスト

- [ ] Jest + React Testing Library のセットアップと設定 (～12/27)

- [ ] 主要コンポーネントのユニットテスト実装（App, SessionControls, EventLog） (～12/30)

- [ ] WebRTC関連機能のモック化とテスト (～01/02)

- [ ] サーバーサイドAPIのテスト実装 (～12/29)

- [ ] Playwright/CypressによるE2Eテストのセットアップ (～01/05)

- [ ] CI/CDパイプラインでのテスト自動実行設定 (～01/07)

## 詳細

### 現在の問題点
- テストファイルが全く存在しない
- 品質保証の仕組みがない
- リグレッション検出ができない
- WebRTCのような複雑な機能のテストが困難

### 実装内容
1. **テスト環境セットアップ**
   \`\`\`json
   // package.json
   {
     \"scripts\": {
       \"test\": \"jest\",
       \"test:watch\": \"jest --watch\",
       \"test:e2e\": \"playwright test\"
     },
     \"devDependencies\": {
       \"@testing-library/react\": \"^13.0.0\",
       \"@testing-library/jest-dom\": \"^5.0.0\",
       \"jest\": \"^29.0.0\",
       \"@playwright/test\": \"^1.0.0\"
     }
   }
   \`\`\`

2. **テスト実装範囲**
   - コンポーネントのレンダリングテスト
   - ユーザーインタラクションテスト
   - WebRTC機能のモックテスト
   - API エンドポイントテスト
   - セッション管理のテスト

3. **品質メトリクス**
   - コードカバレッジ 80% 以上
   - 全コンポーネントのテスト実装
   - CI/CDでのテスト必須化

### 優先度: 高
### 複雑さ: 中〜高

### 関連ファイル
- package.json
- jest.config.js (新規作成)
- tests/ ディレクトリ (新規作成)
- .github/workflows/ (CI/CD設定)"

echo "Issue 3 created: テストフレームワーク導入と品質保証体制構築"

echo "All 3 GitHub Issues created successfully!"
echo ""
echo "作成されたIssue一覧:"
echo "1. セキュリティ強化とAPIキー保護の改善"
echo "2. エラーハンドリングとWebRTCリソース管理の改善" 
echo "3. テストフレームワーク導入と品質保証体制構築"
echo ""
echo "各Issueには具体的な子タスク、実装詳細、関連ファイルが含まれています。"