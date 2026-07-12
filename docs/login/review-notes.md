# テスト観点レビュー — ログイン画面

## Review Information

- Skill Version: v1.1
- Review Date: 2026-07-13（初版: 2026-07-01）
- Reviewer: Claude Code (test-points-review)

対象ファイル:
- `docs/login/test-points-login.csv`

参照ドキュメント:
- `docs/login/research/login-analysis.md`
- `docs/common/research/research-header-footer.md`
- `tests/login/test-login.spec.ts`

参照ソースコード:
- `hotelplanisphere_clone/src/login.js`
- `hotelplanisphere_clone/src/lib/session.js`
- `hotelplanisphere_clone/src/lib/validation.js`
- `hotelplanisphere_clone/ja/login.html`

---

## 総評

入力カテゴリ（メール形式・パスワード文字種・スペース等）は依然として高い網羅度を維持している。一方、前回レビュー（2026-07-01）で指摘した「遷移」「エラー文言・表示箇所」「回帰影響」「ログイン済みリダイレクト」はCSVに未追加のまま。さらにソースコードとの照合で新たに2点の問題が判明した。loginフォームにはパスワードの文字数制限（`minlength`/`maxlength`）が実装されておらず（CSV row 31「文字数 最小未満/最大超過」の観点が成立しない可能性）、退会済み・ロックアウトユーザーの概念が `session.js` に存在しないため（CSV rows 38–39が実装のない機能のテストになっている可能性）。

---

## カテゴリ別カバー状況

凡例: ○ 十分カバーされている　△ 一部あり・補強余地あり　× ほぼなし　― 対象外

| カテゴリ | カバー状況 | コメント |
| --- | --- | --- |
| 表示 | △ | ヘッダー・メイン・フッターの静的要素は充実。SP版でh1が非表示になる仕様（`d-none d-lg-block`）が未カバー |
| 入力 | △ | メール形式・スペース・文字種は詳細。ただしloginフォームにパスワード文字数制限がなく、row 31の観点が無効な可能性あり |
| 認証・権限 | △ | 正常/異常の組み合わせは充実。ログイン済みURLダイレクトアクセスのリダイレクトが未追加。退会済み・ロックアウトの実装がsession.jsに確認できない |
| 遷移 | × | ログイン成功後のマイページ遷移が完全に欠落 |
| エラー | △ | 「挙動」として散在しているが、文言・表示箇所が独立した観点としてない。未入力エラーと認証エラーが別メッセージになることも未カバー |
| 非同期・ローディング | ― | `session.js` の `isValidUser` / `login()` はすべて同期処理。非同期UIは存在しないため対象外に確定 |
| レスポンシブ | △ | PC/SP共通のレイアウト確認は含む。SP版h1非表示・ハンバーガー展開後の項目確認が弱い |
| 回帰影響 | × | ログイン後のナビゲーション変化（index.html / plans.html）が完全に未カバー |
| データ・境界状態 | △ | パスワード文字数境界値はCSVにあるが、loginフォームに制限がないため観点として成立しない可能性。メールアドレス最大文字数も未カバー |

---

## 追加候補

### 採用推奨

```
[遷移] ログイン成功後、マイページ画面（mypage.html）へ遷移すること
根拠: hotelplanisphere_clone/ja/login.html:47（action="./mypage.html"）
視点: ユーザー視点QA
```

```
[認証・権限] ログイン済みユーザーがログインページのURLを直接入力した場合、トップページへリダイレクトされること
根拠: hotelplanisphere_clone/src/login.js:5-8（getSessionUser() → redirectToTop()）
視点: 権限・状態差分QA
```

```
[エラー] 認証失敗時に「メールアドレス、またはパスワードが違います。」がメールアドレス欄とパスワード欄の直下に1件ずつ（計2箇所）表示されること
根拠: src/login.js:17-18（両フィールドに setCustomValidity）/ login.html:51,56（各 .invalid-feedback div）
視点: ユーザー視点QA
```

```
[エラー] 未入力時のエラーメッセージが認証失敗メッセージとは異なる文言で表示されること
根拠: src/lib/validation.js:31-32（valueMissing → t('validation.valueMissing')）/ src/login.js:17（認証失敗 → t('validation.mailOrAddressMismatch')）
視点: 仕様追及型QA / ユーザー視点QA
```

```
[回帰影響] ログイン成功後、index.html / plans.html のヘッダーナビゲーションが「会員登録・ログイン」から「マイページ・ログアウト」へ切り替わること
根拠: src/lib/session.js:102-110（setLoginNavbar()）
視点: 回帰影響QA
```

```
[遷移] ログイン後にログアウトボタンを押下すると、トップページ（index.html）へ遷移すること
根拠: docs/common/research/research-header-footer.md（action="./index.html"）
視点: ユーザー視点QA
```

```
[表示] SP版（lg未満）ではh1タイトル「Hotel Planisphere」が非表示になること
根拠: hotelplanisphere_clone/ja/login.html:16（class="d-none d-lg-block"）
視点: レスポンシブ / 仕様追及型QA
```

---

### 要確認

```
[データ・境界状態] パスワードの文字数制限（最小・最大）がloginフォームに存在するか
確認先: hotelplanisphere_clone/ja/login.html:55（現時点でminlength/maxlength属性なし）
→ CSV row 31「文字数 最小未満/最大超過」が成立しない可能性があるため、観点を削除または「対象外」に変更すべきか確認
視点: 異常系・境界値QA / 仕様追及型QA
```

```
[認証・権限] 退会済みユーザー・ロックアウトユーザーの概念がシステムに存在するか
確認先: src/lib/session.js:35-38（isValidUserはemail+password一致のみ判定。ユーザーオブジェクトにstatusフィールドなし）
→ CSV rows 38-39が実装のない機能のテストになっている可能性が高いため、観点として有効か確認
視点: 仕様追及型QA
```

```
[エラー] 未入力状態でログインボタンを押下した場合のエラーメッセージの文言
確認先: data/ja/message.json の validation.valueMissing の実際の日本語テキスト
視点: 仕様追及型QA
```

---

### 保留

```
[非同期・ローディング] ログイン処理中のローディング表示
保留理由: src/lib/session.js の isValidUser() / login() はすべて同期処理で完結。非同期UIは存在しないことがソースコードで確認できた
視点: 自動化適性QA
```

```
[入力] パスワード入力欄がマスク表示（●）になっていること
保留理由: login.html:55（type="password"）によるブラウザデフォルト動作。E2Eより目視確認向き
視点: 自動化適性QA
```

```
[データ・境界状態] SQLインジェクション・スクリプト文字列（<script>等）の入力挙動
保留理由: クライアントサイドJSのみの構成でDBが存在せず、セキュリティテストとして別スコープで検討すべき
視点: 異常系・境界値QA
```

---

## 仕様確認が必要な点

- **パスワード文字数制限** — loginフォームのHTMLにはminlength/maxlengthがないが、これは意図的な仕様か。signup.htmlとの対比確認が必要
- **退会済み・ロックアウトユーザーの扱い** — session.jsには実装が確認できない。テスト練習サイトとして意図的に省略しているのか、存在する仕様か
- **未入力時のエラーメッセージ文言** — `t('validation.valueMissing')` の実際の日本語テキストをdata/ja/message.jsonで確認

---

## 優先的に見直すべき観点

1. **退会済み・ロックアウト観点の見直し（rows 38-39）** ― `session.js` に実装がなく、現状では存在しない機能のテストになっている可能性が高い。最優先で要否を判断する
2. **パスワード文字数観点の見直し（row 31）** ― loginフォームにminlength/maxlengthがなく観点として成立しない可能性がある。signup側との仕様差異を確認した上で削除または移動を検討
3. **ログイン成功後のマイページ遷移** ― 正常系の最終ゴールがCSVに存在しない状態が続いており、最もリスクが高い欠落
4. **認証失敗エラーメッセージの文言と表示箇所（2箇所）** ― 実装で確認済みだが観点として独立していないため、テストケース作成時に見落とされやすい
5. **ログイン済みリダイレクト** ― `src/login.js:5-8` に実装済みのアクセス制御が完全に未カバーのままで、セキュリティ観点からも優先度が高い
