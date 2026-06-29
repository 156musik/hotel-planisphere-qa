---
name: test-cases-review
description: 指定された画面・機能のテストケースをレビューし、網羅性・再現性・期待値の明確さを確認する。（TODO: 実装予定）
---

# テストケースレビュー

> **TODO**: このSkillは現在未実装です。今後追加予定です。

## 想定する呼び出し方

```
/test-cases-review <テストケースファイルのパス> [画面名]
```

例:
- `/test-cases-review docs/login/test_cases_login.csv ログイン画面`
- `/test-cases-review docs/plans/ プラン一覧画面`

---

## 実装予定の機能

- テストケースの網羅性確認（テスト観点との対応チェック）
- 再現性の確認（前提条件・操作手順・期待値の明確さ）
- 重複・冗長なケースの検出
- 優先度・リスクに基づくケースの分類提案

---

## 備考

- テスト観点レビューは `/test-points-review` を使用してください。
- 実装時は `test-points-review/SKILL.md` の出力形式・方針を参考にする。
