# ヘッダー・フッター 調査レポート

対象サイト: HOTEL PLANISPHERE（テスト自動化練習サイト）

---

## ヘッダー

### 構造概要

ヘッダーは 2 つの要素で構成されています。

1. **サイトタイトル `<h1>`** — デスクトップのみ表示（`d-none d-lg-block`）
2. **ナビゲーションバー `<nav>`** — Bootstrap ダークテーマ（`navbar-dark bg-dark`）

```html
<h1 class="text-center text-uppercase d-none d-lg-block display-3 my-5">Hotel Planisphere</h1>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark py-lg-4">
  ...
</nav>
```

### レスポンシブ対応

| 画面サイズ | h1 タイトル | ブランドリンク | ナビメニュー |
|---|---|---|---|
| モバイル（lg 未満） | 非表示 | 表示（`d-lg-none`） | ハンバーガーメニュー |
| デスクトップ（lg 以上） | 表示 | 非表示 | 展開表示 |

---

### ページ別ナビゲーション構成

#### パターン A：ホーム・宿泊プラン一覧（ログイン状態で動的切り替え）

対象ページ: `index.html`、`plans.html`

```
ホーム | 宿泊予約 | [会員登録 or マイページ] | [ログインボタン or ログアウトボタン]
```

ログイン状態の切り替えは JavaScript で DOM の `display` を制御。

| 要素 | id | 未ログイン時 | ログイン時 |
|---|---|---|---|
| 会員登録リンク | `signup-holder` | 表示（`d-block`） | 非表示（`d-none`） |
| マイページリンク | `mypage-holder` | 非表示（`d-none`） | 表示（`d-block`） |
| ログインボタン | `login-holder` | 表示（`d-block`） | 非表示（`d-none`） |
| ログアウトボタン | `logout-holder` | 非表示（`d-none`） | 表示（`d-block`） |

ログアウトは `<form>` として実装されており、`action="./index.html"` でホームへリダイレクト。

```html
<form action="./index.html" class="form-inline" id="logout-form" novalidate>
  <button type="submit" class="btn btn-outline-success my-2 my-sm-0">ログアウト</button>
</form>
```

---

#### パターン B：ログインページ（固定、動的切り替えなし）

対象ページ: `login.html`

```
ホーム | 宿泊予約 | 会員登録 | ログイン（active）
```

- 動的切り替え用の `id` 属性は使用されていない
- ログインボタンが `active` クラスでハイライト

---

#### パターン C：会員登録ページ（固定）

対象ページ: `signup.html`

```
ホーム | 宿泊予約 | 会員登録（active）| ログインボタン
```

- 会員登録リンクに `active` クラス

---

#### パターン D：マイページ（ログイン後固定）

対象ページ: `mypage.html`

```
ホーム | 宿泊予約 | マイページ（active）| ログアウトボタン
```

- ログイン済み前提のため、動的切り替えなし
- `logout-form` は `action="./index.html"` でホームへ遷移

---

#### パターン E：宿泊予約・予約確認（別ウィンドウ）

対象ページ: `reserve.html`、`confirm.html`

```
Hotel Planisphere（ブランドのみ）
```

- ナビゲーションリンクは一切なし
- 別ウィンドウで開くため、他ページへの遷移を意図的に排除

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand text-uppercase font-weight-bold" href="#">Hotel Planisphere</a>
</nav>
```

---

### 言語別ラベル対応表

| 要素 | 日本語（ja） | 英語（en-US） |
|---|---|---|
| ホームリンク | ホーム | Home |
| 予約リンク | 宿泊予約 | Reserve |
| 会員登録リンク | 会員登録 | Sign up |
| マイページリンク | マイページ | Mypage |
| ログインボタン | ログイン | Login |
| ログアウトボタン | ログアウト | Logout |

---

## フッター

### 構造

全ページ共通。内容は日本語・英語で変わらず完全に同一。

```html
<footer class="text-center py-5">
  <div class="container">
    <ul class="list-inline">
      <li class="list-inline-item"><a href="https://github.com/takeyaqa/hotel-example-site">GitHub</a></li>
    </ul>
    <p class="text-muted">© 2020-2026 Takeshi Kishi</p>
  </div>
</footer>
```

### 内容

| 要素 | 内容 |
|---|---|
| リンク | GitHub リポジトリ（`https://github.com/takeyaqa/hotel-example-site`） |
| コピーライト | © 2020-2026 Takeshi Kishi |

- 全ページ・全言語で同一
- `text-center` で中央揃え

---

## ページ一覧と適用パターン

| ページ | ファイル | ヘッダーパターン | title タグ |
|---|---|---|---|
| ホーム | `index.html` | A | `HOTEL PLANISPHERE - テスト自動化練習サイト` |
| 宿泊プラン一覧 | `plans.html` | A | `宿泊プラン一覧 \| HOTEL PLANISPHERE - ...` |
| ログイン | `login.html` | B | `ログイン \| HOTEL PLANISPHERE - ...` |
| 会員登録 | `signup.html` | C | `会員登録 \| HOTEL PLANISPHERE - ...` |
| マイページ | `mypage.html` | D | `マイページ \| HOTEL PLANISPHERE - ...` |
| 宿泊予約 | `reserve.html` | E | `宿泊予約 \| HOTEL PLANISPHERE - ...` |
| 宿泊予約確認 | `confirm.html` | E | `宿泊予約確認 \| HOTEL PLANISPHERE - ...` |

> ※ ログイン・会員登録・マイページ・予約・確認の各ページには `<meta name="robots" content="noindex">` が設定されており、検索エンジンからのインデックスを除外している。

---

## テスト観点メモ

- ナビゲーションのログイン状態切り替え（パターン A）は JavaScript 依存のため、セッション Cookie・LocalStorage の状態をテスト前後に確認する必要がある
- パターン E（別ウィンドウ）では `window.opener` が有効（`rel="opener"`）で、親ウィンドウへの参照が可能
- ログアウトは `<form>` submit であり、`<a>` リンクではないため、クリック操作でなくフォーム送信として扱う必要がある
- フッターの GitHub リンクは全ページ共通のため、1 回のテストで横断確認が可能
