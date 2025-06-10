# かしカリメモ（仮）要件定義書

## 1. プロダクト概要

### 1.1 目的
お金・モノの貸し借りを「言った／言わない」で揉めないための軽量Webサービス。証書ではなく、ゆるい備忘録的な用途にフォーカス。

### 1.2 ターゲットユーザー
- 知人・友人・家族同士での軽度な貸し借り記録が必要な人
- 法的効力よりも、相手も確認できる程度の軽度な証拠として利用したい人

## 2. 機能要件

### 2.1 基本機能

#### 2.1.1 記録作成機能
- 貸主が以下の情報を入力して記録を作成
  - 貸主名
  - 借主名
  - 金額またはモノの内容
  - 貸した日
  - 返却予定日
  - メモ欄（任意）

#### 2.1.2 記録共有機能
- 作成した記録をリンクで共有
- リンクを知っている人なら誰でもアクセス可能
- URLはランダム生成（例：`/memo/abc123xyz`）

#### 2.1.3 確認・承認機能
- リンク経由でアクセスした人のみ確認ボタンを押下可能
- 貸主・借主どちらか一方の操作で承認完了
- ステータス：未承認 → 承認済み

#### 2.1.4 返却記録機能
- 貸主・借主どちらか一方の操作で返却完了
- ステータス：承認済み → 返却済み

#### 2.1.5 編集機能
- 貸主・借主どちらでも編集可能
- 編集履歴を記録・表示
- 履歴は双方に表示される
- 編集履歴項目：誰が・いつ・何を変更したか

### 2.2 データ管理

#### 2.2.1 保存期間
- 基本的に永続保存
- ユーザーによる手動削除機能は今回は対象外

#### 2.2.2 データ構造
各記録は以下の情報を保持：
- 一意ID（URL生成用）
- 貸主名
- 借主名
- 金額/モノの内容
- 貸した日
- 返却予定日
- メモ欄
- ステータス（未承認/承認済み/返却済み）
- 作成日時
- 編集履歴

#### 2.2.3 複数記録の扱い
- 同じ人同士でも個別の記録として管理
- 記録同士の関連付けは今回は対象外

## 3. 非機能要件

### 3.1 ユーザビリティ
- シンプルで分かりやすい画面構成
- 直感的な操作フロー

### 3.2 認証
- アカウント登録不要
- リンクベースのアクセス制御
- 名前は簡易入力（ニックネーム・本名どちらでも可）

### 3.3 通知
- システムからの自動通知は不要
- 画面内でステータス変更が分かれば十分

## 4. 対象外機能（将来検討）

### 4.1 MVP対象外
- LINE連携（将来的な検討事項）
- 通知機能（メール・プッシュ通知等）
- 統計機能
- 検索機能
- カテゴリ分類
- ユーザーアカウント管理
- 記録の一括管理・一覧表示

### 4.2 技術的対象外
- 法的効力を持つ機能
- 高度なセキュリティ機能
- データエクスポート機能

## 5. ユーザーフロー

### 5.1 基本フロー
1. 貸主が記録作成画面で情報入力
2. システムがユニークなリンクを生成
3. 貸主が借主にリンクを共有（LINE等で）
4. 借主がリンクにアクセスして内容確認
5. 借主が確認ボタンを押下（承認）
6. 返却時に貸主または借主が返却ボタンを押下
7. 記録が完了ステータスに変更

### 5.2 編集フロー
1. リンクにアクセス
2. 編集ボタンを押下
3. 内容を修正
4. 保存（編集履歴に記録される）

## 6. エラーハンドリング

### 6.1 想定エラー
- 存在しないリンクへのアクセス
- 同時編集による競合
- 必須項目の未入力

### 6.2 対応方針
- 分かりやすいエラーメッセージ表示
- 適切な画面遷移

## 7. 技術的検討事項

### 7.1 URL設計
- ランダムな文字列によるURL生成
- 推測困難な長さ・複雑さの確保

### 7.2 データベース設計
- 記録テーブル
- 編集履歴テーブル

### 7.3 セキュリティ
- URLの推測困難性確保
- 基本的なXSS・SQLインジェクション対策

## 8. システムアーキテクチャ

### 8.1 技術スタック
- **フロントエンド・バックエンド**: Next.js 15 (App Router)
- **データベース**: Supabase (PostgreSQL)
- **認証**: サーバーサイド処理（匿名アクセス）
- **デプロイ**: Vercel（推奨）

### 8.2 フォルダ構成
```
app/
├── page.tsx                 // トップページ（新規作成）
├── create/
│   └── page.tsx            // 記録作成画面
├── memo/
│   └── [id]/
│       ├── page.tsx        // 記録確認・操作画面
│       └── edit/
│           └── page.tsx    // 編集画面
└── api/
    └── memo/
        ├── route.ts        // 記録CRUD API
        └── [id]/
            └── route.ts    // 個別記録API
```

### 8.3 データベース設計

#### 8.3.1 memos テーブル
```sql
CREATE TABLE memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lender_name TEXT NOT NULL,
  borrower_name TEXT NOT NULL,
  amount_or_item TEXT NOT NULL,
  loan_date DATE NOT NULL,
  due_date DATE,
  memo TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'returned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 8.3.2 memo_histories テーブル
```sql
CREATE TABLE memo_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memo_id UUID NOT NULL REFERENCES memos(id) ON DELETE CASCADE,
  editor_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('created', 'edited', 'confirmed', 'returned')),
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 8.3.3 インデックス
```sql
CREATE INDEX idx_memos_id ON memos(id);
CREATE INDEX idx_memo_histories_memo_id ON memo_histories(memo_id);
CREATE INDEX idx_memo_histories_created_at ON memo_histories(created_at);
```

### 8.4 API設計

#### 8.4.1 エンドポイント一覧
- `POST /api/memo` - 記録作成
- `GET /api/memo/[id]` - 記録取得
- `PUT /api/memo/[id]` - 記録更新
- `PATCH /api/memo/[id]/status` - ステータス更新（確認・返却）

#### 8.4.2 レスポンス形式
```typescript
// 記録データ
interface Memo {
  id: string;
  lenderName: string;
  borrowerName: string;
  amountOrItem: string;
  loanDate: string;
  dueDate?: string;
  memo?: string;
  status: 'pending' | 'confirmed' | 'returned';
  createdAt: string;
  updatedAt: string;
  histories: MemoHistory[];
}

// 履歴データ
interface MemoHistory {
  id: string;
  editorName: string;
  action: 'created' | 'edited' | 'confirmed' | 'returned';
  changes?: Record<string, any>;
  createdAt: string;
}
```

### 8.5 セキュリティ設計

#### 8.5.1 URL生成
- UUIDv4を使用した推測困難なID生成
- 36文字の英数字・ハイフンによる十分な複雑性確保

#### 8.5.2 アクセス制御
- サーバーサイドでのID存在確認
- 不正なアクセスに対する適切なエラーレスポンス

#### 8.5.3 データ検証
- 入力値のバリデーション（文字数制限、必須項目チェック）
- SQLインジェクション対策（SupabaseのPrepared Statement使用）
- XSS対策（Next.jsのデフォルト機能 + 追加のサニタイズ）

### 8.6 パフォーマンス設計
- Next.js App Routerのキャッシング機能活用
- Supabaseのコネクションプーリング利用
- 静的生成可能な部分の最適化