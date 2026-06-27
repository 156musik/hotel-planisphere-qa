プラン一覧画面（plans.html）テスト観点抽出のための事前調査
1. 画面構造の整理
ページ全体のセクション構成

<body>
├── <h1>              ページタイトル（PC のみ表示）
├── <nav>             ナビゲーションバー
├── <div.container>   メインコンテンツ
│   ├── <h2>          ページ見出し「宿泊プラン一覧」
│   ├── おすすめプランカード（静的・HTML固定）
│   └── <div#plan-list>  動的プラン一覧エリア（JS生成）
└── <footer>          フッター
コード根拠: ja/plans.html 全体

主要UIブロック詳細
セクション	要素	内容
ページタイトル	<h1 class="d-none d-lg-block">	「Hotel Planisphere」PCのみ表示
ナビゲーション	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">	ログイン状態で項目が切り替わる
ページ見出し	<h2>	「宿泊プラン一覧」固定テキスト
おすすめプラン	<div class="card">	HTML静的定義、常に表示
動的プラン一覧	<div id="plan-list">	JS（$.getJSON）で生成、ログイン状態・rank依存
フッター	<footer>	GitHubリンク、コピーライト
コード根拠: ja/plans.html:16-87

プラン一覧エリアの詳細構造
初期状態（JSロード前）


<div class="row" id="plan-list">
  <div class="spinner-border mx-auto" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
データ取得中はスピナーが表示される
role="status" 属性あり（Playwrightの getByRole('status') で取得可能）
コード根拠: ja/plans.html:74-78

データ取得後（JS生成後）

スピナーが #plan-list の .html() で上書きされ、プランカード群に置き換わる。

コード根拠: src/plans.js:22-23（$('#plan-list').html(planHtml)）

2. プラン関連UIの構造
おすすめプランカード（id=0 固定・静的HTML）

<div class="card text-center shadow-sm">
  <div class="card-header">⭐おすすめプラン⭐</div>
  <div class="card-body">
    <h5 class="card-title">お得な特典付きプラン</h5>
    <ul class="list-unstyled">
      <li>大人1名7,000円</li>
      <li>1名様から</li>
      <li>スタンダードツイン</li>
    </ul>
    <a href="./reserve.html?plan-id=0" class="btn btn-primary"
       target="_blank" rel="opener">このプランで予約</a>
  </div>
  <div class="card-footer text-muted">本日限り</div>
</div>
card-header（「⭐おすすめプラン⭐」）と card-footer（「本日限り」）が存在する唯一のカード
ログイン状態に関わらず常に表示される
plan_data.json の id=0 を表示しているが、動的プランリストからは id !== 0 の条件で除外される
コード根拠: ja/plans.html:55-72、src/plans.js:19

動的プランカード（JS生成）
各プランは以下の構造で生成される。


<div class="col-12 col-md-6 col-lg-4">
  <div class="card text-center shadow-sm mb-3">
    <!-- only="member" or "premium" の場合のみ card-header が付く -->
    <div class="card-header">会員限定 または ❤️プレミアム会員限定❤️</div>
    <div class="card-body">
      <h5 class="card-title">プラン名</h5>
      <ul class="list-unstyled">
        <li>大人1名X,XXX円</li>
        <li>X名様から</li>
        <li>部屋タイプ名</li>
      </ul>
      <a href="./reserve.html?plan-id=X" class="btn btn-primary"
         target="_blank" rel="opener">このプランで予約</a>
    </div>
    <!-- card-footer は存在しない -->
  </div>
</div>
コード根拠: src/plans.js:32-52

おすすめプランとの構造差分

要素	おすすめプラン（id=0）	動的プラン（id=1〜）
card-header	常にあり（「⭐おすすめプラン⭐」）	only設定がある場合のみ
card-footer	あり（「本日限り」）	なし
外側カラム	col-lg-9 mx-auto	col-12 col-md-6 col-lg-4
繰り返し構造
動的プランは for ループで生成され、全プランが同一の genPlanHtml() 関数で出力される。カード構造は一定。card-header の有無のみ条件分岐。

コード根拠: src/plans.js:16-23、src/plans.js:32-53

3. 表示要素の抽出
テキスト情報
表示内容	生成元	形式
プラン名	plan_data.json の name	そのまま表示
料金	plan_data.json の roomBill	Intl.NumberFormat('ja-JP', {currency: 'JPY'}) でフォーマット → 例: 大人1名7,000円
最少人数	plan_data.json の minHeadCount	{}名様から に埋め込み → 例: 1名様から
部屋タイプ	plan_data.json の room	そのまま表示
会員バッジ	message.json の plans.memberOnly	「会員限定」
プレミアムバッジ	message.json の plans.premiumOnly	「❤️プレミアム会員限定❤️」
コード根拠: src/plans.js:43-48、src/lib/i18n.js:16-17（JPY フォーマッタ）、data/ja/message.json

ユーザー操作可能要素
要素	セレクタ・属性	動作
各プランの「このプランで予約」リンク	<a class="btn btn-primary" href="./reserve.html?plan-id=X">	新しいタブで予約ページを開く（target="_blank"）
ナビ「ホーム」リンク	<a href="./index.html">	トップページへ遷移
ナビ「宿泊予約」リンク	<a href="./plans.html">	同ページ（active状態）
ナビ「会員登録」リンク	<a href="./signup.html">	未ログイン時のみ表示
ナビ「マイページ」リンク	<a href="./mypage.html">	ログイン済みのみ表示
ナビ「ログイン」ボタン	<a class="btn btn-outline-secondary" href="./login.html" role="button">	未ログイン時のみ表示
ナビ「ログアウト」ボタン	<button type="submit" class="btn btn-outline-success">	ログイン済みのみ表示
フッター「GitHub」リンク	<a href="https://github.com/...">	外部リンク
ナビバー折りたたみボタン（SP）	<button class="navbar-toggler">	SP時にナビを開閉
コード根拠: ja/plans.html 全体

4. レスポンシブ差分
表示切替要素
要素	PC（lg以上）	SP（lg未満）	制御クラス
<h1> ページタイトル	表示	非表示	d-none d-lg-block
ナビバーブランド名	非表示	表示	d-lg-none
ナビバー項目	展開表示	折りたたみ（ハンバーガーメニュー）	collapse navbar-collapse
コード根拠: ja/plans.html:16-44

カラムレイアウト変化
要素	SP（xs）	タブレット（md）	PC（lg）
おすすめプランコンテナ	全幅	全幅	9/12幅・中央寄せ
動的プランカード	1列（全幅）	2列	3列
コード根拠: ja/plans.html:49（col-lg-9 mx-auto）、src/plans.js:39（col-12 col-md-6 col-lg-4）

5. 状態依存要素
ナビゲーション（ログイン状態による切替）
要素ID	未ログイン	ログイン済み	初期クラス
#signup-holder（会員登録）	表示	非表示	d-block
#login-holder（ログイン）	表示	非表示	d-block
#mypage-holder（マイページ）	非表示	表示	d-none
#logout-holder（ログアウト）	非表示	表示	d-none
コード根拠: ja/plans.html:30-43、src/lib/session.js:102-110

プラン一覧（ログイン状態・rank による表示差分）
状態	表示プラン数（id=0除く）	表示されるプラン
未ログイン	6件	素泊まり / 出張ビジネス / エステ・マッサージ / 貸し切り露天風呂 / カップル限定 / テーマパーク優待
一般会員（rank: normal）	8件	上記6件 ＋ ディナー付き / お得なプラン
プレミアム会員（rank: premium）	9件	上記8件 ＋ プレミアムプラン
コード根拠: src/lib/session.js:118-130、data/ja/plan_data.json、e2e/ja/plans.spec.ts:16-82（実テストで検証済みの件数）

カードヘッダーの条件付き表示
plan.only の値	card-header の表示	テキスト
null	なし	—
"member"	あり	「会員限定」
"premium"	あり	「❤️プレミアム会員限定❤️」
コード根拠: src/plans.js:32-38、data/ja/message.json

6. DOM属性情報
プランリンク（全プラン共通）
属性	値
class	btn btn-primary
href	./reserve.html?plan-id=<id>
target	_blank（新しいタブで開く）
rel	opener
コード根拠: src/plans.js:49、ja/plans.html:66

ナビゲーション要素のID・クラス
要素	id	状態クラス（初期）
会員登録 <li>	signup-holder	d-block
マイページ <li>	mypage-holder	d-none
ログイン <li>	login-holder	d-block
ログアウト <li>	logout-holder	d-none
ログアウトフォーム	logout-form	—
コード根拠: ja/plans.html:30-43

スピナー（ローディング状態）
属性	値	用途
role	status	Playwrightで getByRole('status') 取得可能
class	spinner-border mx-auto	Bootstrapスピナー
データ取得完了後は #plan-list の innerHTML ごと上書きされ、DOM上から消える。

コード根拠: ja/plans.html:75-78、src/plans.js:22-23

現行テストで未カバーの観点
e2e/ja/plans.spec.ts の現行テストはプラン件数と見出し文字列の一致のみ検証している。以下はコードから確認できる未テスト項目。

観点	根拠
スピナーがデータ取得後に非表示になること	plans.spec.ts:15（toBeHidden() のみ確認）
「このプランで予約」リンクのhref属性値が正しいこと（plan-id一致）	src/plans.js:49
リンクが target="_blank" で新しいタブを開くこと	ja/plans.html:66、src/plans.js:49
会員限定・プレミアム限定のcard-headerが表示されること	src/plans.js:32-38
未ログイン時に「会員登録」「ログイン」がナビに表示されること	ja/plans.html:30-37
ログイン済み時に「マイページ」「ログアウト」がナビに表示されること	src/lib/session.js:102-110
おすすめプランのcard-footerに「本日限り」が表示されること	ja/plans.html:68-70
SP幅でh1が非表示になること	ja/plans.html:16（d-none d-lg-block）
SP幅でプランが1列表示になること	src/plans.js:39（col-12）
料金の表示フォーマット（大人1名X,XXX円形式）	src/lib/i18n.js:16-17、src/plans.js:45
