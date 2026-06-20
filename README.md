# Hotel Planisphere QA Portfolio

## Overview

Hotel Planisphere を題材として、テスト設計および Playwright による E2E テスト自動化を実践するためのポートフォリオです。

本リポジトリでは以下を成果物として管理しています。

* テスト観点
* テストケース
* Playwright による自動テスト
* GitHub Actions による自動実行

---

## Test Target

対象サイト

* Hotel Planisphere
* https://hotel-example-site.takeyaqa.dev/

現在対応済み機能

* ログイン機能

今後対応予定

* 宿泊プラン一覧
* 宿泊予約
* 会員登録

---

## Repository Structure

```text
docs/
├── login
│   ├── test-points.csv
│   └── test-cases.csv

tests/
├── login
│   └── login.spec.ts
```

---

## Test Design

以下の流れでテスト設計を実施しています。

1. テスト観点の洗い出し
2. テストケースの作成
3. Playwrightによる自動化
4. 実行結果の確認

観点・ケース・コードの対応関係を意識して管理しています。

---

## Current Test Coverage

### Login

正常系

* 一般会員ログイン
* プレミアム会員ログイン

異常系

* メールアドレス誤り
* パスワード誤り

---

## Tech Stack

* Playwright
* TypeScript
* Node.js
* GitHub Actions

---

## AI Assistance

本プロジェクトでは補助的に生成AIを利用しています。

利用用途

* テスト観点の整理
* テストケースレビュー
* Playwright実装時の調査
* README作成支援

最終的な設計判断および実装内容の確認は自身で行っています。

---

## Future Improvements

* 宿泊プラン一覧画面のテスト追加
* 宿泊予約機能のテスト追加
* テストコードの共通化
* Page Object Model（POM）の導入検討
* テストケースの継続的な改善
* GitHub Actionsの運用改善

```