# かしカリメモ

お金・モノの貸し借りを「言った／言わない」で揉めないための軽量Webサービス

## 🌟 特徴

- **シンプルな記録作成**: 貸し借りの詳細を簡単に入力
- **リンク共有**: 記録をURLで共有、相手も内容を確認可能
- **編集履歴**: 誰がいつ何を変更したかを記録
- **返却管理**: 返却済みのステータス管理
- **モダンUI**: shadcn/uiを使用した美しいインターフェース

## 🚀 技術スタック

- **Frontend/Backend**: Next.js 15 (App Router)
- **Database**: Firebase Firestore
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📱 機能一覧

### 基本機能
- ✅ 記録作成（貸した人、借りた人、金額/モノ、日付、メモ）
- ✅ 記録共有（ユニークなURL生成）
- ✅ 返却済み管理
- ✅ 編集機能（変更履歴付き）
- ✅ レスポンシブデザイン

### UI/UX
- ✅ shadcn/ui コンポーネント
- ✅ 日本語対応の日付ピッカー
- ✅ カード型レイアウト
- ✅ モダンなボタン・フォーム

## 🛠️ セットアップ

### 前提条件
- Node.js 18以上
- Firebase プロジェクト

### インストール

1. リポジトリをクローン
\`\`\`bash
git clone <repository-url>
cd kashikarimemo
\`\`\`

2. 依存関係をインストール
\`\`\`bash
npm install
\`\`\`

3. 環境変数を設定
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. \`.env.local\` にFirebase設定を追加
\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

5. Firestoreデータベースを設定
\`\`\`bash
firebase deploy --only firestore:rules
\`\`\`

6. 開発サーバーを起動
\`\`\`bash
npm run dev
\`\`\`

## 📊 データベース構造

### memos コレクション
\`\`\`typescript
{
  id: string
  lentByName: string        // 貸した人
  borrowedByName: string    // 借りた人
  amountOrItem: string      // 金額またはモノ
  loanDate: string          // 貸した日
  dueDate?: string          // 返却予定日
  memo?: string             // メモ
  status: 'active' | 'returned'
  createdAt: Timestamp
  updatedAt: Timestamp
}
\`\`\`

### memo_histories コレクション
\`\`\`typescript
{
  id: string
  memoId: string            // 関連するメモのID
  editorName: string        // 編集者名
  action: 'created' | 'edited' | 'returned'
  changes?: Record<string, { from: unknown; to: unknown }>
  createdAt: Timestamp
}
\`\`\`

## 🎨 UIコンポーネント

このプロジェクトでは[shadcn/ui](https://ui.shadcn.com/)を使用しています：

- Button
- Card (CardHeader, CardTitle, CardContent)
- Input
- Label
- Textarea
- Calendar (日付ピッカー)
- Popover

## 📝 API エンドポイント

### メモ関連
- \`POST /api/memo\` - 新しい記録を作成
- \`GET /api/memo/[id]\` - 記録の詳細を取得
- \`PUT /api/memo/[id]\` - 記録を更新

## 🔧 開発コマンド

\`\`\`bash
npm run dev        # 開発サーバー起動
npm run build      # プロダクションビルド
npm run start      # プロダクションサーバー起動
npm run lint       # ESLintチェック
\`\`\`

## 🚀 デプロイ

### Vercel（推奨）
1. Vercelにプロジェクトを接続
2. 環境変数を設定
3. 自動デプロイが実行されます

### 手動デプロイ
\`\`\`bash
npm run build
npm run start
\`\`\`

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 コントリビューション

1. フォークする
2. フィーチャーブランチを作成 (\`git checkout -b feature/AmazingFeature\`)
3. 変更をコミット (\`git commit -m 'Add some AmazingFeature'\`)
4. ブランチにプッシュ (\`git push origin feature/AmazingFeature\`)
5. プルリクエストを作成

## 📞 サポート

問題がある場合は、GitHubのIssuesで報告してください。