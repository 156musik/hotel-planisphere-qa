# Plan Display Analysis

## 調査日時

2026-06-25

## 概要

プラン一覧表示および予約ページアクセス時の権限制御について調査した。

---

## `canDisplayPlan()` 調査結果

### 関数定義

`src/lib/session.js:118-130`

```js
export function canDisplayPlan(plan, user) {
  if (!plan.only) {
    return true;
  }
  if (!user) {
    return false;
  }
  if (plan.only === 'member') {
    return true;
  } else if (plan.only === 'premium') {
    return (user.rank === 'premium');
  }
}
```

### 呼び出し元（2ファイル）

| ファイル | 呼び出し箇所 | 用途 |
|---|---|---|
| `src/plans.js` | L19 | プラン一覧への表示可否判定 |
| `src/reserve.js` | L31 | 予約ページへのアクセス可否判定 |

### `plan.only` の種類

`data/ja/plan_data.json` に定義された全10プランの `only` 値。

| `only` の値 | 意味 | 該当プラン（id） |
|---|---|---|
| `null` | 制限なし | 0, 4, 5, 6, 7, 8, 9（7件） |
| `"member"` | 会員限定 | 2（ディナー付きプラン）、3（お得なプラン）（2件） |
| `"premium"` | プレミアム会員限定 | 1（プレミアムプラン）（1件） |

コード根拠: `data/ja/plan_data.json` 全体

---

## ログイン状態別の挙動

`canDisplayPlan(plan, user)` の引数 `user` は、`getUser(session)` の戻り値。

- **未ログイン時**: session が空文字 → `getUser("")` は `null` を返す → `user = null`
- **ログイン済み時**: session がメールアドレス → `getUser(email)` がユーザオブジェクトを返す → `user.rank` が `"normal"` または `"premium"`

コード根拠: `src/plans.js:8-12`、`src/reserve.js:10-11`、`src/lib/session.js:35-38`

### `plan.only = null`（制限なし）のとき

```js
if (!plan.only) {
  return true;  // 無条件でtrue
}
```

| 状態 | 戻り値 |
|---|---|
| 未ログイン | `true` |
| 一般会員 | `true` |
| プレミアム会員 | `true` |

### `plan.only = "member"`（会員限定）のとき

```js
if (!user) {
  return false;  // userがnullなら即false
}
if (plan.only === 'member') {
  return true;  // userが存在すれば無条件でtrue
}
```

| 状態 | `user` の値 | 戻り値 |
|---|---|---|
| 未ログイン | `null` | `false` |
| 一般会員 | `{ rank: "normal", ... }` | `true` |
| プレミアム会員 | `{ rank: "premium", ... }` | `true` |

### `plan.only = "premium"`（プレミアム限定）のとき

```js
if (!user) {
  return false;  // userがnullなら即false
}
} else if (plan.only === 'premium') {
  return (user.rank === 'premium');  // rankで判定
}
```

| 状態 | `user` の値 | 戻り値 |
|---|---|---|
| 未ログイン | `null` | `false` |
| 一般会員 | `{ rank: "normal", ... }` | `false` |
| プレミアム会員 | `{ rank: "premium", ... }` | `true` |

---

## UI上の表示差分

### `plans.html`（プラン一覧）

`src/plans.js:17-23` の処理:

```js
for (let i = 0; i < data.length; i++) {
  if (data[i].id !== 0 && canDisplayPlan(data[i], user)) {
    planHtml += genPlanHtml(data[i]);
  }
}
$('#plan-list').html(planHtml);
```

`id=0` のプランは `canDisplayPlan()` の結果に関係なく無条件で除外される。

コード根拠: `src/plans.js:19`（`data[i].id !== 0` の条件）

**表示されるプランの差分:**

| 状態 | 表示されるプラン |
|---|---|
| 未ログイン | `only: null` の6件（id: 4, 5, 6, 7, 8, 9）のみ |
| 一般会員 | `only: null` の6件 ＋ `only: "member"` の2件（id: 2, 3） = 8件 |
| プレミアム会員 | `only: null` の6件 ＋ `only: "member"` の2件 ＋ `only: "premium"` の1件（id: 1） = 9件 |

加えて `genPlanHtml()` 内でカードヘッダーの表示が変化する。

コード根拠: `src/plans.js:32-38`

| `plan.only` | カードヘッダー表示 |
|---|---|
| `null` | なし |
| `"member"` | 「会員限定」（`data/ja/message.json` の `plans.memberOnly`） |
| `"premium"` | 「❤️プレミアム会員限定❤️」（`data/ja/message.json` の `plans.premiumOnly`） |

### `reserve.html`（予約ページ）

`src/reserve.js:31-34` の処理:

```js
if (!plan || !canDisplayPlan(plan, user)) {
  redirectToTop();
  return;
}
```

URLパラメータ `?plan-id=<id>` で指定したプランを `canDisplayPlan()` で検証し、表示不可の場合はトップページへリダイレクト。

| 操作 | 状態 | 挙動 |
|---|---|---|
| `reserve.html?plan-id=1`（プレミアム限定）へアクセス | 未ログイン | トップページへリダイレクト |
| `reserve.html?plan-id=1` へアクセス | 一般会員 | トップページへリダイレクト |
| `reserve.html?plan-id=1` へアクセス | プレミアム会員 | 予約ページが表示される |
| `reserve.html?plan-id=2`（会員限定）へアクセス | 未ログイン | トップページへリダイレクト |
| `reserve.html?plan-id=2` へアクセス | 一般会員・プレミアム会員 | 予約ページが表示される |
| `reserve.html?plan-id=4`（制限なし）へアクセス | 未ログイン・全会員 | 予約ページが表示される |

---

## 全体まとめ（状態×プランのマトリクス）

| プランid | プラン名 | `only` | 未ログイン | 一般会員 | プレミアム会員 |
|---|---|---|---|---|---|
| 0 | お得な特典付きプラン | `null` | 除外（id=0固定） | 除外（id=0固定） | 除外（id=0固定） |
| 1 | プレミアムプラン | `"premium"` | 非表示 | 非表示 | 表示 |
| 2 | ディナー付きプラン | `"member"` | 非表示 | 表示 | 表示 |
| 3 | お得なプラン | `"member"` | 非表示 | 表示 | 表示 |
| 4 | 素泊まり | `null` | 表示 | 表示 | 表示 |
| 5 | 出張ビジネスプラン | `null` | 表示 | 表示 | 表示 |
| 6 | エステ・マッサージプラン | `null` | 表示 | 表示 | 表示 |
| 7 | 貸し切り露天風呂プラン | `null` | 表示 | 表示 | 表示 |
| 8 | カップル限定プラン | `null` | 表示 | 表示 | 表示 |
| 9 | テーマパーク優待プラン | `null` | 表示 | 表示 | 表示 |
