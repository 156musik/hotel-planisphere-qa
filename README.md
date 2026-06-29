# Hotel Planisphere QA Portfolio

## Overview

Hotel Planisphere を題材として、テスト設計から Playwright による E2E テスト自動化までを実践するポートフォリオです。

本リポジトリでは以下を成果物として管理しています。

* テスト観点
* テストケース
* Playwright による E2E テスト
* GitHub Actions による自動実行
* Claude Code Skills を活用したテストレビュー

---

## Test Target

### 対象サイト

* Hotel Planisphere
* https://hotel-example-site.takeyaqa.dev/

### 実装済み

* ログイン機能

### 調査・設計中

* 宿泊プラン一覧
* ヘッダー・フッター

### 今後対応予定

* 宿泊予約
* 会員登録

---

## Getting Started

### 前提条件

* Node.js（LTS推奨）
* npm

### セットアップ

```bash
git clone https://github.com/156musik/hotel-planisphere-qa.git
cd hotel-planisphere-qa
npm install
npx playwright install
```

### テスト実行

```bash
# 全テスト実行
npx playwright test

# ログイン画面のみ
npx playwright test tests/login/test-login.spec.ts

# ブラウザを表示して実行
npx playwright test --headed

# レポート表示
npx playwright show-report
```

---

## Repository Structure

```text
.github/
└── workflows/
    └── playwright.yml

.claude/
└── skills/
    ├── test-points-review/
    └── test-cases-review/

docs/
├── login/
│   ├── test_perspectives_login.csv
│   ├── test_cases_login.csv
│   ├── login-analysis.md
│   ├── plan-display-analysis.md
│   ├── design-process.md
│   └── review-notes.md
├── plans/
│   └── research-plans-page.md
└── header-footer/
    └── research-header-footer.md

tests/
└── login/
    └── test-login.spec.ts

playwright.config.ts
```

---

## CI / GitHub Actions

`main` ブランチへの push および Pull Request をトリガーとして Playwright テストを自動実行します。

* 実行環境：Ubuntu (`ubuntu-latest`)
* Playwright Config に従ってブラウザを実行
* テスト結果は GitHub Actions Artifacts として保存

---

## Test Design

テスト設計は以下の流れで実施しています。

1. 画面・仕様調査
2. テスト観点作成
3. Claude Code Skills による観点レビュー
4. テストケース作成
5. Claude Code Skills によるケースレビュー
6. Playwright による自動化
7. 実行結果の確認・改善

観点・ケース・コードの対応関係を意識しながら管理しています。

---

## Current Test Coverage

### Login

#### 正常系

* 一般会員ログイン
* プレミアム会員ログイン

会員ステータスごとに認証・表示内容が変わる可能性を考慮し、それぞれをテスト対象としています。

#### 異常系

* メールアドレス誤り
* パスワード誤り

ログイン失敗の主な要因として入力ミスが発生しやすいと考え、優先度の高いケースから E2E テストを実装しています。

---

## Tech Stack

* Playwright
* TypeScript
* Node.js
* GitHub Actions
* Claude Code Skills

---

## AI Assistance

本プロジェクトでは生成AIを補助的に活用しています。

活用内容

* テスト観点レビュー
* テストケースレビュー
* Playwright 実装時の技術調査
* README 作成支援
* Claude Code Skills の作成・改善

AI の提案はそのまま採用せず、画面仕様・ソースコード・実際の挙動を確認した上で採否を判断しています。

---

## Future Improvements

* 宿泊プラン一覧画面のテスト追加
* ヘッダー・フッターのテスト追加
* 宿泊予約機能のテスト追加
* テストコードの共通化
* Page Object Model（POM）の導入
* Claude Code Skills の継続的な改善
* GitHub Actions の運用改善
