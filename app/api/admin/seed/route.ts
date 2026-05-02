import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_SECRET = process.env.ADMIN_SEED_SECRET || "";

interface SkillDef {
  title: string;
  short_description: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  compatible_tools: string[];
  skill_content: string;
}

const SKILLS_BATCH1: SkillDef[] = [
  {
    title: "日本語AIコードレビュー",
    short_description: "3段階（致命的/警告/提案）でコードを徹底レビュー。Claude Code・Cursor・Copilot対応",
    description: `## 概要

このスキルはAIエージェントに日本語で高品質なコードレビューを行わせるためのプロンプトです。

レビューは以下の3段階で出力されます：

- 🔴 **致命的** — バグ・セキュリティ問題・データ破壊リスクなど即座に修正が必要な問題
- 🟡 **警告** — パフォーマンス低下・保守性の問題・ベストプラクティス違反
- 🟢 **提案** — コードの改善案・可読性向上・リファクタリング候補

## 対応ツール

- Claude Code
- Cursor
- GitHub Copilot
- その他OpenAI API対応ツール

## 使い方

1. SKILL.mdをダウンロードして任意のディレクトリに配置
2. AIエージェントで \`/review\` コマンドまたはスキルを呼び出し
3. レビューしたいコードを指定して実行`,
    category: "dev-tools",
    subcategory: "code-review",
    tags: ["コードレビュー", "Claude", "Cursor", "Copilot", "日本語", "セキュリティ"],
    compatible_tools: ["claude-code", "cursor", "copilot"],
    skill_content: `# 日本語AIコードレビュー

## role
あなたは経験豊富なシニアエンジニアです。コードレビューを日本語で行います。

## task
提供されたコードを以下の3段階で詳細にレビューしてください。

## output_format
レビュー結果は必ず以下の形式で出力してください：

### 🔴 致命的（即座に修正が必要）
バグ、セキュリティ脆弱性、データ破壊リスクなど

### 🟡 警告（早急に対応推奨）
パフォーマンス問題、保守性の低下、ベストプラクティス違反

### 🟢 提案（改善推奨）
可読性向上、リファクタリング候補、テスト追加の提案

## rules
- 指摘は具体的に行番号を示すこと
- 各指摘には修正例を提示すること
- 問題がない場合は「✅ 問題なし」と明記すること
- 日本語で回答すること
`,
  },
  {
    title: "日本語Gitコミットメッセージ自動生成",
    short_description: "git diffから日本語Conventional Commitsフォーマットのコミットメッセージを自動生成",
    description: `## 概要

\`git diff\` の出力から、**Conventional Commits** フォーマットに準拠した日本語コミットメッセージを自動生成するスキルです。

## サポートするtype

| type | 用途 |
|------|------|
| feat | 新機能 |
| fix | バグ修正 |
| docs | ドキュメントのみの変更 |
| style | フォーマット変更（機能に影響なし） |
| refactor | リファクタリング |
| test | テストの追加・修正 |
| chore | ビルド・ツール設定の変更 |`,
    category: "dev-tools",
    subcategory: "code-gen",
    tags: ["git", "コミット", "Conventional Commits", "自動生成", "日本語"],
    compatible_tools: ["claude-code", "cursor"],
    skill_content: `# 日本語Gitコミットメッセージ自動生成

## role
あなたはGitのエキスパートです。git diffを分析して最適なコミットメッセージを生成します。

## task
提供されたgit diffの内容を分析し、Conventional Commitsフォーマットに準拠した日本語コミットメッセージを生成してください。

## format
\`\`\`
<type>(<scope>): <subject（日本語・50文字以内）>

<body（変更内容の詳細・日本語）>
\`\`\`

## types
- feat: 新機能の追加
- fix: バグの修正
- docs: ドキュメントのみの変更
- style: フォーマット変更（機能に影響なし）
- refactor: リファクタリング
- test: テストの追加・修正
- chore: ビルド・ツール設定の変更
- perf: パフォーマンス改善

## rules
- subjectは日本語で簡潔に（命令形・現在形）
- bodyは変更の「何を・なぜ」を説明する
- コミットメッセージのみを出力し、説明は不要
`,
  },
  {
    title: "日本語README.md自動生成",
    short_description: "プロジェクト構造・package.jsonから高品質な日本語READMEを自動生成",
    description: `## 概要

プロジェクトのファイル構造や \`package.json\` などの設定ファイルを分析して、高品質な日本語 README.md を自動生成するスキルです。

## 生成されるREADMEの構成

1. プロジェクト名・説明
2. 技術スタック
3. 必要要件
4. インストール手順
5. 使い方
6. 環境変数
7. ライセンス`,
    category: "dev-tools",
    subcategory: "code-gen",
    tags: ["README", "ドキュメント", "自動生成", "日本語", "markdown"],
    compatible_tools: ["claude-code", "cursor"],
    skill_content: `# 日本語README.md自動生成

## role
あなたは優秀なテクニカルライターです。プロジェクトを分析して高品質なREADMEを作成します。

## task
提供されたプロジェクト情報を分析し、日本語のREADME.mdを生成してください。

## rules
- 日本語で記述すること
- コードブロックは適切な言語タグを付けること
- 不明な情報は「[TODO: 追記してください]」とプレースホルダーを入れること
- README.mdの内容のみを出力すること（説明不要）
`,
  },
  {
    title: "Next.jsエラー解決アシスタント",
    short_description: "Next.jsのエラーを分析し、日本語で解決策を提示。App Router 13/14/15対応",
    description: `## 概要

Next.js で発生するエラーを分析し、**原因・解決策・予防策** を日本語でわかりやすく説明するスキルです。

## 対応バージョン

- Next.js 13（App Router）
- Next.js 14
- Next.js 15

## 対応するエラーカテゴリ

- ビルドエラー（TypeScript・ESLint・モジュール解決）
- ランタイムエラー（Hydration・Server/Client Component境界）
- デプロイエラー（Vercel・環境変数・Edge Runtime）`,
    category: "dev-tools",
    subcategory: "debugging",
    tags: ["Next.js", "デバッグ", "App Router", "TypeScript", "エラー解決", "日本語"],
    compatible_tools: ["claude-code", "cursor"],
    skill_content: `# Next.jsエラー解決アシスタント

## role
あなたはNext.jsの専門家です。エラーを分析して日本語で解決策を提示します。

## task
提供されたNext.jsのエラーメッセージとコードを分析し、解決策を日本語で説明してください。

## output_format
### エラーの概要 / ### 原因 / ### 即座の解決策（コード例付き） / ### 予防策

## rules
- 日本語で回答すること
- コード例は必ず含めること
`,
  },
  {
    title: "日本語コード解説",
    short_description: "コードを「入力→処理→出力」の構造で日本語わかりやすく解説",
    description: `## 概要

難しいコードを **「入力→処理→出力」** の構造で日本語でわかりやすく解説するスキルです。

## 対応言語

TypeScript / JavaScript / Python / Rust / Go / Java / C++ / SQL / Bash など

## 解説の構成

1. 全体像 — このコードが何をするのかの一言説明
2. 入力 — 受け取るデータ・引数
3. 処理 — 各ステップで何が行われるか
4. 出力 — 返す値・副作用
5. ポイント — 重要な概念・注意事項`,
    category: "dev-tools",
    subcategory: "code-review",
    tags: ["コード解説", "学習", "日本語", "ドキュメント", "初心者向け"],
    compatible_tools: ["claude-code", "cursor", "copilot"],
    skill_content: `# 日本語コード解説

## role
あなたは優れた教育者であり、経験豊富なエンジニアです。複雑なコードを誰にでもわかりやすく説明します。

## task
提供されたコードを「入力→処理→出力」の構造で日本語でわかりやすく解説してください。

## output_format
📋 全体像 / 📥 入力 / ⚙️ 処理の流れ / 📤 出力 / 💡 重要なポイント

## rules
- 日本語で回答すること
- 専門用語は初出時に説明を添えること
`,
  },
];

const SKILLS_BATCH2: SkillDef[] = [
  {
    title: "日本語テスト自動生成",
    short_description: "コードを分析し、日本語コメント付きのテストコードを自動生成するSKILL.md。Jest/Vitest/pytest対応。",
    description: `## 概要

テスト対象のコードを分析し、**日本語コメント付きのテストコード**を自動生成するスキルです。

## 対応テストフレームワーク

- Jest（TypeScript / JavaScript）
- Vitest（Vite プロジェクト）
- pytest（Python）

## テストの網羅性

- ✅ 正常系 — 正しい入力に対して期待通りの結果が返ること
- ✅ 異常系 — 不正な入力・エラー時の挙動
- ✅ 境界値 — 最小値・最大値・空文字・null など

## カバレッジ目標

**80%以上**を目指したテストスイートを生成します。

## 使い方

テスト対象のコードをAIエージェントに渡すと、日本語のdescribe/itブロック付きでテストコードが生成されます。`,
    category: "dev-tools",
    subcategory: "test-automation",
    tags: ["テスト", "Jest", "Vitest", "pytest", "日本語", "自動生成", "TDD"],
    compatible_tools: ["claude-code", "cursor"],
    skill_content: `# 日本語テスト自動生成

## role
あなたはテスト駆動開発のエキスパートです。高品質なテストコードを日本語コメント付きで生成します。

## task
提供されたコードを分析し、テストコードを自動生成してください。

## output_rules
- describe/itブロックの説明文は日本語で記述すること
- 正常系・異常系・境界値のテストケースを網羅すること
- カバレッジ目標は80%以上
- 各テストには「// なぜこのテストが必要か」のコメントを付けること

## framework_detection
- package.jsonにjestがあれば → Jest形式
- package.jsonにvitestがあれば → Vitest形式
- pyproject.tomlまたはrequirements.txtにpytestがあれば → pytest形式
- 不明な場合はJest形式で生成すること

## example_jest
\`\`\`typescript
describe('add関数', () => {
  // 正常系: 2つの正の整数を足す基本的なケース
  it('正の整数を正しく加算できる', () => {
    expect(add(2, 3)).toBe(5);
  });

  // 境界値: 0との計算
  it('0を加算しても値が変わらない', () => {
    expect(add(5, 0)).toBe(5);
  });

  // 異常系: 不正な入力
  it('非数値を渡すとエラーをスローする', () => {
    expect(() => add('a', 1)).toThrow();
  });
});
\`\`\`

## rules
- テストファイルのみを出力すること
- モックが必要な場合はjest.fn()またはvi.fn()を使用すること
- 非同期処理にはasync/awaitを使用すること
`,
  },
  {
    title: "Supabase設計ガイド",
    short_description: "Supabaseのテーブル設計・RLS・認証設定を日本語でガイドするSKILL.md。",
    description: `## 概要

Supabase プロジェクトの設計を包括的にサポートするスキルです。

## サポート範囲

### データベース設計
- テーブル設計（正規化・リレーション）
- インデックス最適化
- マイグレーション管理

### RLS（Row Level Security）
- ポリシー設計パターン
- ユーザー・ロール別アクセス制御
- 既存ポリシーのレビューと改善

### 認証設計
- OAuth（GitHub・Google・Twitter）設定
- セッション管理
- JWT カスタムクレーム

### Storage 設計
- バケット設定（public/private）
- アクセス制御ポリシー
- ファイルサイズ・MIME タイプ制限

## 使い方

schema.sql や migration ファイルを渡すと、設計の問題点と改善案を日本語で出力します。`,
    category: "web-dev",
    subcategory: "database",
    tags: ["Supabase", "データベース", "RLS", "PostgreSQL", "認証", "日本語"],
    compatible_tools: ["claude-code", "cursor"],
    skill_content: `# Supabase設計ガイド

## role
あなたはSupabaseとPostgreSQLの専門家です。データベース設計を日本語でガイドします。

## task
提供されたschema.sql・migrationファイル・設計要件を分析し、改善提案を日本語で出力してください。

## review_checklist

### テーブル設計
- [ ] 主キーはUUIDまたはSERIALを使用しているか
- [ ] 外部キー制約が適切に設定されているか
- [ ] created_at/updated_atのタイムスタンプがあるか
- [ ] NOT NULL制約が適切に設定されているか
- [ ] インデックスが必要なカラムに設定されているか

### RLSポリシー
- [ ] 全テーブルでRLSが有効になっているか
- [ ] SELECT/INSERT/UPDATE/DELETEそれぞれのポリシーが定義されているか
- [ ] auth.uid()を使用したユーザー識別が正しいか
- [ ] 管理者用のサービスロールポリシーが適切か

### セキュリティ
- [ ] パスワードや機密情報がテーブルに直接保存されていないか
- [ ] anon keyでアクセスできてはいけないデータがRLSで保護されているか

## output_format
各問題点について：
1. 問題の説明（日本語）
2. 推奨する解決策（SQLコード例付き）
3. 重要度（高/中/低）

## rules
- 日本語で回答すること
- SQLコード例は必ず含めること
- Supabase固有の機能（auth.uid()等）を積極的に活用した提案をすること
`,
  },
  {
    title: "Vercelデプロイチェッカー",
    short_description: "Vercelデプロイ前にビルドエラー・環境変数・設定漏れを日本語でチェックするSKILL.md。",
    description: `## 概要

Vercel デプロイ前の事前チェックを自動実行し、**デプロイ失敗を未然に防ぐ**スキルです。

## チェック項目

### ビルドチェック
- \`npm run build\` / \`yarn build\` の成功確認
- TypeScript コンパイルエラーの検出
- ESLint エラーの検出

### 環境変数チェック
- \`.env.local\` と Vercel 設定の整合性
- 必須環境変数の未設定を検出
- \`NEXT_PUBLIC_\` プレフィックスの適切な使用

### 設定ファイルチェック
- \`next.config.js\` / \`next.config.ts\` の設定確認
- 画像最適化設定（\`domains\`）
- リダイレクト・リライト設定

### SEO・パフォーマンス
- OGP 画像の設定
- robots.txt / sitemap.xml の存在
- Core Web Vitals への影響確認

## 出力形式

チェックリスト形式（✅ 問題なし / ⚠️ 要確認 / ❌ 修正必要）で日本語出力します。`,
    category: "devops",
    subcategory: "deploy",
    tags: ["Vercel", "デプロイ", "Next.js", "チェックリスト", "日本語", "CI/CD"],
    compatible_tools: ["claude-code", "cursor"],
    skill_content: `# Vercelデプロイチェッカー

## role
あなたはVercelとNext.jsのデプロイ専門家です。デプロイ前の問題を事前に発見します。

## task
提供されたプロジェクトのファイル（package.json、next.config.js、.env.local等）を分析し、デプロイ前チェックを実行してください。

## checklist

### 1. ビルド確認
- [ ] npm run buildが成功するか（TypeScript型エラー、ESLintエラーなし）
- [ ] next.config.jsの設定が正しいか

### 2. 環境変数
- [ ] Vercelに設定すべき環境変数がすべてリストアップされているか
- [ ] NEXT_PUBLIC_プレフィックスが適切か（クライアントサイドで必要なもの）
- [ ] 機密情報がNEXT_PUBLIC_で誤って公開されていないか

### 3. 画像・アセット
- [ ] next/imageのdomains/remotePatterns設定が正しいか
- [ ] public/ディレクトリの必要なファイルが存在するか
- [ ] OGP画像（og-image.png等）が設定されているか

### 4. SEO
- [ ] robots.txtが正しく設定されているか
- [ ] sitemap.xmlが存在するか（または動的生成されているか）
- [ ] 各ページのmetadata/title/descriptionが設定されているか

### 5. パフォーマンス
- [ ] 不必要なconsole.logが残っていないか
- [ ] 大きな画像ファイルが最適化されているか

## output_format
各チェック項目を以下の形式で出力：
- ✅ 問題なし: [説明]
- ⚠️ 要確認: [説明と推奨対応]
- ❌ 修正必要: [問題の説明と修正方法]

最後に「デプロイ可否判定」を日本語で出力すること。

## rules
- 日本語で回答すること
- 修正が必要な場合はコード例を提示すること
`,
  },
  {
    title: "日本語API設計レビュー",
    short_description: "REST/GraphQL APIのエンドポイント設計を日本語でレビュー。命名規則・レスポンス形式・エラーハンドリングを確認。",
    description: `## 概要

REST API または GraphQL API のエンドポイント設計を包括的にレビューし、**改善提案を日本語で出力**するスキルです。

## レビュー項目

### URL・命名規則
- RESTful な URL 設計（リソース指向）
- 複数形・単数形の統一
- バージョニング（\`/v1/\`, \`/api/v1/\`）

### HTTP メソッドと レスポンス
- GET / POST / PUT / PATCH / DELETE の適切な使い分け
- HTTP ステータスコードの正しい使用
- JSON レスポンス形式の統一

### エラーハンドリング
- エラーレスポンスの標準化
- バリデーションエラーの表現

### セキュリティ
- 認証・認可の設計
- レート制限

### その他
- ページネーション設計
- フィルタリング・ソート

## 使い方

API の定義ファイル（OpenAPI / Swagger）またはルートコードを渡すと、レビュー結果を日本語で出力します。`,
    category: "web-dev",
    subcategory: "api-dev",
    tags: ["API", "REST", "GraphQL", "設計", "レビュー", "日本語", "OpenAPI"],
    compatible_tools: ["claude-code", "cursor"],
    skill_content: `# 日本語API設計レビュー

## role
あなたはAPI設計のエキスパートです。RESTful APIの設計をレビューし、改善提案を日本語で出力します。

## task
提供されたAPIの定義・ルートコードを分析し、設計レビューを実施してください。

## review_points

### URL設計
- リソース名は名詞・複数形（例: /users, /posts）
- ネストは2階層まで（/users/:id/posts）
- バージョニング（/api/v1/）の適切な使用

### HTTPメソッド
- GET: データ取得（副作用なし）
- POST: リソース作成
- PUT: リソース全体更新
- PATCH: リソース部分更新
- DELETE: リソース削除

### レスポンス形式
\`\`\`json
{
  "data": {},
  "error": null,
  "meta": { "total": 100, "page": 1 }
}
\`\`\`

### エラーレスポンス
\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "メールアドレスが無効です",
    "details": []
  }
}
\`\`\`

### HTTPステータスコード
- 200: 成功
- 201: 作成成功
- 400: バリデーションエラー
- 401: 未認証
- 403: 権限なし
- 404: リソースなし
- 409: 競合
- 422: 処理不可
- 500: サーバーエラー

## output_format
各問題点について：
1. 問題の説明（日本語）
2. 改善前のコード
3. 改善後のコード
4. 理由

## rules
- 日本語で回答すること
- コード例は必ず含めること
`,
  },
  {
    title: "SEOメタタグ自動生成",
    short_description: "Webページを分析し、最適なtitle・description・OGPタグを日本語で自動生成するSKILL.md。",
    description: `## 概要

Web ページのコンテンツを分析し、**SEO に最適化されたメタタグを自動生成**するスキルです。

## 生成するメタタグ

| タグ | 説明 |
|------|------|
| \`<title>\` | 60文字以内 |
| \`<meta name="description">\` | 120文字以内 |
| \`og:title\` | SNS シェア用タイトル |
| \`og:description\` | SNS シェア用説明文 |
| \`og:image\` | OGP 画像 URL |
| \`twitter:card\` | Twitter カードタイプ |
| \`canonical\` | 正規 URL |
| JSON-LD | 構造化データ（Article / Product / FAQ） |

## キーワード抽出

ページのコンテンツから自然に**SEO キーワード**を抽出して title・description に反映します。

## 対応フレームワーク

- Next.js（App Router metadata 形式）
- HTML の meta タグ直書き形式
- どちらの形式でも出力可能

## 使い方

ページのコンテンツ（テキスト・コード）を渡すと、SEO 最適化されたメタタグが生成されます。`,
    category: "web-dev",
    subcategory: "seo",
    tags: ["SEO", "メタタグ", "OGP", "JSON-LD", "Next.js", "自動生成", "日本語"],
    compatible_tools: ["claude-code", "cursor"],
    skill_content: `# SEOメタタグ自動生成

## role
あなたはSEOとWeb開発の専門家です。ページコンテンツからSEO最適化されたメタタグを生成します。

## task
提供されたページコンテンツ（テキスト・HTML・コンポーネント）を分析し、SEOに最適化されたメタタグを生成してください。

## output_rules

### title
- 60文字以内
- 主要キーワードを含める
- サイト名を末尾に追加（例: ページタイトル | サイト名）

### meta description
- 120文字以内
- 行動を促す文言を含める
- ページの内容を正確に要約

### OGP
- og:title（70文字以内）
- og:description（200文字以内）
- og:image（1200×630px推奨）
- og:type（website / article）

### JSON-LD
ページタイプに応じて以下を生成：
- ブログ記事 → Article
- 商品ページ → Product
- FAQページ → FAQPage
- 会社概要 → Organization

## output_format

### Next.js App Router形式
\`\`\`typescript
export const metadata = {
  title: "...",
  description: "...",
  openGraph: { ... },
};
\`\`\`

### HTMLメタタグ形式
\`\`\`html
<title>...</title>
<meta name="description" content="...">
<meta property="og:title" content="...">
\`\`\`

## rules
- 日本語コンテンツの場合は日本語でメタタグを生成
- キーワードは自然な形で含め、キーワードの詰め込みは避ける
- 要求されたフレームワーク形式で出力すること
`,
  },
  {
    title: "日本語プルリクエスト作成",
    short_description: "git diffを分析し、日本語で分かりやすいPRのタイトルと本文を自動生成するSKILL.md。",
    description: `## 概要

ブランチ間の \`git diff\` を分析し、**日本語で分かりやすい PR（Pull Request）のタイトルと本文**を自動生成するスキルです。

## PR 本文の構成

1. **概要** — この PR で何を変更したか（1〜2文）
2. **変更内容** — 変更した内容の箇条書き（カテゴリ別に整理）
3. **影響範囲** — 変更の影響を受ける機能・ページ
4. **テスト手順** — レビュアーが動作確認すべき手順
5. **レビュー観点** — 特に確認してほしい点

## 変更量に応じた自動整理

- ファイル数が多い場合 → カテゴリ別（フロントエンド / バックエンド / DB / テスト）に整理
- Breaking Change がある場合 → ⚠️ 警告を PR 本文の冒頭に表示

## 使い方

\`git diff main..feature-branch\` の出力をAIに渡すと、日本語の PR タイトルと本文が生成されます。`,
    category: "dev-tools",
    subcategory: "code-review",
    tags: ["PR", "プルリクエスト", "git", "自動生成", "日本語", "GitHub", "GitLab"],
    compatible_tools: ["claude-code", "cursor"],
    skill_content: `# 日本語プルリクエスト作成

## role
あなたはチームコミュニケーションのエキスパートです。git diffからレビュアーに分かりやすいPRを作成します。

## task
提供されたgit diffを分析し、日本語でPRのタイトルと本文を生成してください。

## output_format

### PRタイトル
- 50文字以内
- Conventional Commits形式（feat/fix/refactor等）
- 例: \`feat: ユーザー認証機能を追加\`

### PR本文
\`\`\`markdown
## 概要
（このPRで何を変更したか1〜2文で説明）

## 変更内容
- 変更点1
- 変更点2

## 影響範囲
- 影響を受ける機能・ページ

## テスト手順
1. 手順1
2. 手順2

## レビュー観点
- 特に確認してほしい点
\`\`\`

## breaking_change_detection
以下のパターンを検出した場合は本文冒頭に警告を追加：
- APIのエンドポイント削除・変更
- DBスキーマの破壊的変更
- 既存の関数シグネチャ変更

## rules
- 日本語で生成すること
- 変更ファイルが多い場合はカテゴリ別に整理すること
- PRタイトルと本文のみを出力すること（説明不要）
`,
  },
  {
    title: "package.json最適化",
    short_description: "package.jsonを分析し、不要な依存関係・バージョン問題・スクリプト改善を日本語で提案するSKILL.md。",
    description: `## 概要

\`package.json\` を分析して**最適化提案を日本語で出力**するスキルです。

## チェック項目

### 依存関係
- 未使用の依存関係を検出
- \`dependencies\` と \`devDependencies\` の分類ミスを修正
- 重複パッケージの検出

### バージョン管理
- \`^\`（マイナーまで許容）と \`~\`（パッチのみ許容）の使い分け
- メジャーバージョンの更新が必要なパッケージを検出
- 既知の脆弱性があるパッケージの警告

### scripts
- よく使うコマンドの登録漏れ
- 冗長なスクリプトの整理
- \`pre\` / \`post\` フックの活用提案

### その他
- \`engines\` フィールド（Node.js バージョン）の推奨
- \`type: "module"\` の設定確認
- ライセンス情報

## 使い方

\`package.json\` を渡すと、改善リストを日本語で出力します。`,
    category: "devops",
    subcategory: "ci-cd",
    tags: ["npm", "package.json", "依存関係", "最適化", "セキュリティ", "日本語"],
    compatible_tools: ["claude-code", "cursor"],
    skill_content: `# package.json最適化

## role
あなたはNode.jsパッケージ管理のエキスパートです。package.jsonを分析して最適化提案を出します。

## task
提供されたpackage.jsonを分析し、改善提案を日本語で出力してください。

## analysis_points

### 1. 依存関係の分類
- dependenciesに入るべきもの: 実行時に必要なパッケージ
- devDependenciesに入るべきもの: ビルド・テスト・開発時のみ必要なパッケージ
- 分類ミスの例: TypeScript型定義(@types/*)はdevDependenciesに

### 2. バージョン指定の方針
- ^（キャレット）: マイナー・パッチ更新を許容（推奨）
- ~（チルダ）: パッチ更新のみ許容（保守的）
- 固定バージョン: 再現性重視（フロントエンド本番依存）

### 3. scriptsの改善
よく使うスクリプトテンプレート：
\`\`\`json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
\`\`\`

### 4. enginesフィールド
\`\`\`json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
\`\`\`

## output_format
改善提案を以下の形式で出力：
- 🔴 重要: セキュリティ脆弱性・重大な問題
- 🟡 推奨: 最適化・ベストプラクティス
- 🟢 提案: 任意の改善案

各提案には修正前/後のJSONコードを含めること。

## rules
- 日本語で回答すること
- npm audit相当の問題がある場合は警告すること
`,
  },
  {
    title: "日本語エラーログ解析",
    short_description: "エラーログ・スタックトレースを分析し、原因と対処法を日本語で分かりやすく解説するSKILL.md。",
    description: `## 概要

エラーログやスタックトレースを分析し、**原因・対処手順・再発防止策を日本語でわかりやすく解説**するスキルです。

## 対応ログ形式

- Node.js / TypeScript のエラーとスタックトレース
- Python のトレースバック
- ブラウザコンソールのエラー
- Vercel / AWS / GCP のサーバーログ
- データベースエラー（PostgreSQL・MySQL）

## 出力形式

1. **エラー種別** — エラーの分類と一行説明
2. **発生箇所** — ファイル・行番号の特定
3. **原因の説明** — 初心者にも分かる日本語解説
4. **対処手順** — ステップ別の修正方法（コード例付き）
5. **再発防止策** — 同じエラーを起こさないために

## 複数エラー時の対応

複数のエラーが含まれる場合は**重要度順（エラー → 警告 → 情報）**にソートして出力します。`,
    category: "dev-tools",
    subcategory: "debugging",
    tags: ["エラーログ", "デバッグ", "スタックトレース", "日本語", "Node.js", "Python"],
    compatible_tools: ["claude-code", "cursor", "copilot"],
    skill_content: `# 日本語エラーログ解析

## role
あなたはデバッグのエキスパートです。エラーログを分析して原因と解決策を日本語で説明します。

## task
提供されたエラーログ・スタックトレースを分析し、原因と対処法を日本語で説明してください。

## analysis_process
1. エラーの種類を特定（TypeError / ReferenceError / NetworkError等）
2. スタックトレースから発生箇所を特定
3. エラーメッセージのキーワードから原因を推定
4. 対処法を検討

## output_format

### エラー種別
エラーの分類と一行説明

### 発生箇所
ファイルパスと行番号（スタックトレースから抽出）

### 原因
初心者にも分かる日本語での解説（技術的背景を含む）

### 対処手順
\`\`\`
// ステップ1: xxx
// ステップ2: xxx
\`\`\`

### 再発防止策
同じエラーを防ぐためのベストプラクティス

## common_errors

### Cannot read properties of undefined
→ nullチェック・オプショナルチェーン（?.）を追加

### Module not found
→ npmインストール漏れ・パスの確認

### TypeScript型エラー
→ 型アサーション・型ガードの追加

### CORS error
→ サーバー側のCORSヘッダー設定を確認

## rules
- 日本語で回答すること
- 専門用語は初出時に説明を添えること
- 複数エラーがある場合は重要度順（エラー→警告→情報）に出力すること
`,
  },
  {
    title: "Tailwind CSS設計ガイド",
    short_description: "Tailwind CSSのクラス設計・レスポンシブ対応・カスタム設定を日本語でガイドするSKILL.md。",
    description: `## 概要

Tailwind CSS のクラス設計をレビュー・改善し、**保守性が高くレスポンシブなコード**に整えるスキルです。

## レビュー・改善項目

### クラス設計
- 重複クラスの排除
- \`@apply\` を使ったコンポーネント化すべきパターンの検出
- クラスの順序統一（Tailwind の推奨順序）

### レスポンシブ設計
- \`sm\` / \`md\` / \`lg\` / \`xl\` / \`2xl\` の適切な使い分け
- モバイルファースト設計の確認

### ダークモード
- \`dark:\` プレフィックスの適切な使用
- カラーパレットの統一

### tailwind.config.js 最適化
- カスタムカラー・フォント・スペーシングの整理
- \`content\` パスの設定確認
- プラグイン（\`@tailwindcss/typography\` 等）の活用提案

### アクセシビリティ
- コントラスト比の確認
- フォーカスインジケーターの設定

## 使い方

コンポーネントコードを渡すと、Tailwind CSS 設計の改善提案を日本語で出力します。`,
    category: "web-dev",
    subcategory: "css-design",
    tags: ["Tailwind CSS", "CSS", "レスポンシブ", "ダークモード", "アクセシビリティ", "日本語"],
    compatible_tools: ["claude-code", "cursor", "copilot"],
    skill_content: `# Tailwind CSS設計ガイド

## role
あなたはTailwind CSSの専門家です。コンポーネントのスタイリングをレビュー・改善します。

## task
提供されたコンポーネントコードのTailwind CSSクラスをレビューし、改善提案を日本語で出力してください。

## review_checklist

### クラス整理
- [ ] 同じスタイルが繰り返し使われているパターンはないか（コンポーネント化推奨）
- [ ] クラスの順序が統一されているか（レイアウト→サイズ→スペーシング→色→タイポグラフィ→その他）
- [ ] 不要なクラスが含まれていないか

### レスポンシブ
- [ ] モバイルファーストで設計されているか（プレフィックスなしがモバイル）
- [ ] 各ブレークポイントで適切に表示されるか

### ダークモード
- [ ] dark:プレフィックスが適切に設定されているか
- [ ] bg-white → bg-white dark:bg-gray-900 のような対応

### アクセシビリティ
- [ ] フォーカス時のスタイルが設定されているか（focus:ring等）
- [ ] テキストのコントラスト比が十分か

## improvement_patterns

### コンポーネント化すべきパターン
\`\`\`css
/* 繰り返し使われるボタンスタイル */
@apply bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors;
\`\`\`

### レスポンシブグリッド
\`\`\`html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
\`\`\`

## rules
- 日本語で回答すること
- 改善前/後のコードを必ず示すこと
- Tailwind v3とv4の違いがある場合は明記すること
`,
  },
  {
    title: "日本語技術ブログ下書き生成",
    short_description: "コードや技術トピックから日本語の技術ブログ記事の下書きを自動生成。Note・Zenn・Qiita向け。",
    description: `## 概要

技術トピックやコードから**日本語の技術ブログ記事の下書きを自動生成**するスキルです。

## 対応プラットフォーム

| プラットフォーム | 特徴 |
|--------------|------|
| **Zenn** | Markdown・エンジニア向け |
| **Qiita** | Markdown・技術情報共有 |
| **Note** | リッチテキスト・幅広い読者 |

## 記事構成

1. **タイトル** — SEO・クリックしたくなるタイトル
2. **導入** — 読者の共感を得る課題提起
3. **本文** — 手順 + コード例（コメント付き）
4. **まとめ** — 学びのポイントと次のステップ
5. **関連リンク** — 参考資料のプレースホルダー

## 文体・スタイル

- 「です/ます」調でわかりやすく
- 初心者にも読めるよう専門用語に説明を付与
- コードブロックには**説明コメント**を付与
- SEO キーワードを自然に含める

## 使い方

技術トピックや作ったコードを渡すと、そのまま投稿できる下書きが生成されます。`,
    category: "docs",
    subcategory: "tech-docs",
    tags: ["ブログ", "Zenn", "Qiita", "Note", "技術記事", "自動生成", "日本語", "SEO"],
    compatible_tools: ["claude-code", "cursor", "copilot"],
    skill_content: `# 日本語技術ブログ下書き生成

## role
あなたは経験豊富な技術ライターです。エンジニアが読みたくなる技術記事を日本語で生成します。

## task
提供された技術トピック・コード・アイデアから、日本語の技術ブログ記事の下書きを生成してください。

## article_structure

### 1. タイトル
- 30〜40文字程度
- 「〇〇する方法」「〇〇を試した」「〇〇入門」など具体的に
- SEOキーワードを含める

### 2. 導入（200〜300文字）
- 読者の共感を得る問題提起
- この記事で解決できることを明示
- 対象読者を明示

### 3. 本文
各セクションの構成：
- ## 見出し（h2）
- 説明文（背景・理由）
- コードブロック（コメント付き）
- 実行結果・スクリーンショットのプレースホルダー

### 4. まとめ（200文字程度）
- 学んだことの箇条書き
- 次のステップへの誘導

### 5. 参考リンク
- [参考記事名](URL) の形式でプレースホルダーを配置

## platform_format

### Zenn / Qiita
Markdown形式で生成。コードブロックには言語タグを付与。

### Note
HTMLに近いリッチテキストを考慮した構成で生成。

## rules
- 「です/ます」調で統一
- 専門用語は初出時に括弧で説明
- コードブロックには必ず説明コメントを付ける
- SEOキーワードは自然な形で含め、詰め込まない
- 記事の下書きのみを出力すること（説明不要）
`,
  },
];

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    secret?: string;
    seller_id?: string;
    seller_name?: string;
    seller_avatar?: string;
    batch?: "1" | "2" | "all";
  };

  if (!ADMIN_SECRET || body.secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sellerId = body.seller_id ?? "skills-market";
  const sellerName = body.seller_name ?? "Skills Market 公式";
  const sellerAvatar = body.seller_avatar ?? "https://avatars.githubusercontent.com/u/197975374?v=4";

  let skills: SkillDef[] = [];
  const batch = body.batch ?? "all";
  if (batch === "1") skills = SKILLS_BATCH1;
  else if (batch === "2") skills = SKILLS_BATCH2;
  else skills = [...SKILLS_BATCH1, ...SKILLS_BATCH2];

  const results: { title: string; id?: string; error?: string; fileUploaded?: boolean }[] = [];

  for (const skill of skills) {
    try {
      const encoder = new TextEncoder();
      const bytes = encoder.encode(skill.skill_content);
      const fileName = `${sellerId}/${crypto.randomUUID()}/SKILL.md`;

      let skillFilePath: string | null = null;
      const { error: uploadError } = await supabaseAdmin.storage
        .from("skill-files")
        .upload(fileName, bytes, { contentType: "text/markdown" });
      if (!uploadError) skillFilePath = fileName;

      const { data, error } = await supabaseAdmin
        .from("skills")
        .insert({
          title: skill.title,
          short_description: skill.short_description,
          description: skill.description,
          category: skill.category,
          subcategory: skill.subcategory,
          price_type: "free",
          price: 0,
          tags: skill.tags,
          compatible_tools: skill.compatible_tools,
          skill_file_path: skillFilePath,
          seller_id: sellerId,
          seller_name: sellerName,
          seller_avatar: sellerAvatar,
        })
        .select("id")
        .single();

      if (error) {
        results.push({ title: skill.title, error: error.message });
      } else {
        results.push({ title: skill.title, id: (data as { id: string }).id, fileUploaded: !!skillFilePath });
      }
    } catch (err) {
      results.push({ title: skill.title, error: err instanceof Error ? err.message : "Unknown error" });
    }
  }

  return NextResponse.json({ ok: true, results });
}
