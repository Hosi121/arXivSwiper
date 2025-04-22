# arXiv‑Swiper (arXiv‑Tinder)

## 1. プロジェクト概要

**目的**：数あるarXiv論文の中から、自分に合った「読みたい論文」を直感的に選べるWebアプリを提供する。
**コンセプト**：Tinderライクなスワイプ操作で、タイトル＋著者＋イントロを確認しながら「読む／パス」を連続実行。

---

## 2. 背景・課題

- arXivには毎日多数の論文が投稿されるが、探したい分野の「良質な論文」を効率的に見つけにくい
- タイトルだけでは内容が把握しづらく、従来の一覧型UIだと読むまでのハードルが高い
- ユーザーは短時間でフィルタリング→意思決定→保存を直感的に行いたい

---

## 3. ソリューション

- **スワイプUI**：カード形式で論文を1枚ずつ表示。右スワイプで「読むリストに追加」、左スワイプで「パス」
- **フィルタリングパネル**：画面左（または上部）に常設し、スワイプ中もいつでも絞り込み可能
- **マイリスト管理**：Likeした論文は別タブで一覧化。PDFリンクやタグ付けで後から再訪問しやすく

---

## 4. 主要機能

1. **スワイプ選択**  
   - カードに「タイトル／主著者＋et al.／Introduction抜粋（200字程度）」を表示  
   - ジェスチャー・ボタン操作の両対応（スマホ＆PC）

2. **フィルタリング**  
   - **分野タグ**：arXiv公式カテゴリ（例：cs.LG, stat.ML, physics.optics…）のマルチセレクト  
   - **日付範囲**：投稿日カレンダー＋スライダーによる指定  
   - **キーワード検索**：タイトル・イントロ内の検索  
   - **ホット度ソート**：被引用数や新着アクセス順位

3. **マイリスト**  
   - Like済み論文のサムネイル一覧  
   - タグ付け／メモ機能  
   - PDF外部リンク（arXiv.org）へワンクリック

4. **ユーザー設定**  
   - フィルタ条件のプリセット保存  
   - ダークモード切替

---

## 5. UI/UX イメージ（詳細）

### 5.1 ホーム画面

- **ヘッダー**：アプリロゴ・ユーザーメニュー
- **フィルタパネル**（左サイド or モーダル）  
  - カテゴリ選択チェックボックス  
  - 日付スライダー＋カレンダー入力  
  - 検索バー＋ホット度ソート切替
- **メインカードエリア**  
  - 真ん中に大きく論文カード（Responsive：最大横幅600px）  
  - カード下部に「パス」「読む」アイコンボタン  
  - スワイプ／クリックで操作

### 5.2 マイリスト画面

- **一覧表示**：グリッド or リスト切替
- 各アイテムに「タグ」「メモアイコン」「PDFアイコン」
- フィルタパネルの項目を再利用してリスト内検索

### 5.3 モバイル挙動

- フィルタはスライドインパネル
- ジェスチャー感度チューニング
- オフライン時は直近カードをキャッシュ

---

## 6. 技術構成

### フロントエンド

- **言語／フレームワーク**：TypeScript + React + Vite
- **スタイリング**：Tailwind CSS + Headless UI（Dialog, Menu, Switchなど）
- **ルーティング**：react-router-dom
- **状態管理**：Zustand（軽量ストア）
- **API通信**：Axios（リトライ／タイムアウト設定）
- **フォーム管理**：react-hook-form（フィルタフォーム）
- **テスト**：Jest + React Testing Library
- **Lint／Formatter**：ESLint + Prettier
- **CI/CD**：GitHub Actions（ビルド→テスト→Vercelデプロイ）

### バックエンド

- **BaaS**：Supabase
  - **Auth**：Email/Password, OAuth（Google, GitHub）
  - **DB**：PostgreSQL
  - **Storage**：サムネイルキャッシュ用
  - **Edge Functions**：CronでarXiv API更新ジョブ

### arXiv連携

- **API**：arXiv OAI‑PMH（XML） or arXiv REST
- **更新頻度**：毎日深夜に最新論文メタデータをフェッチ

### インフラ・デプロイ

- **ホスティング**：Vercel (Front＋Edge Functions)
- **環境変数管理**：Vercel Secrets + `.env.local`
- **ドメイン**：カスタムドメイン設定
- **モニタリング**：Vercel Analytics + Sentry（フロント＆Edge）

---

## 7. データベース構造（Supabase）
Supabase (PostgreSQL) のテーブル定義例：

```sql
-- users table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  name text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- papers table
create table public.papers (
  id text primary key, -- arXiv ID, e.g. "2101.00001"
  title text not null,
  authors text[] not null,
  intro text,
  published_at date,
  category text,
  hot_score numeric
);

-- user_likes table
create table public.user_likes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  paper_id text references public.papers(id) on delete cascade,
  liked_at timestamp with time zone default timezone('utc', now()),
  unique(user_id, paper_id)
);
```


不足している部分：

UI/UX：UIコンポーネントの実装が不足。モバイル挙動に関する実装が不足。
バックエンド：Supabaseとの連携、Auth、Edge Functionsが未実装。
arXiv連携：Cronジョブが未設定。
インフラ・デプロイ：Vercelへのデプロイ状況、環境変数管理の設定状況、ドメイン設定状況、モニタリング設定状況を確認する必要がある。