# ホーム画面アイコン（PWA）導入手順

URL の文字列そのものにはロゴは入りません。**そのURLが指すHTMLの `<head>` にアイコン宣言を仕込む**ことで、
「ホーム画面に追加」したときに専用ロゴ＋アプリ名で並び、全画面で開きます。

このフォルダには、すぐ使える一式が入っています。

```
s-mobile-icon-180.png   (apple-touch-icon 用)
s-mobile-icon-192.png   (manifest 用)
s-mobile-icon-512.png   (manifest / スプラッシュ用)
s-mobile.webmanifest    (マニフェスト)
README.md               (この手順書)
```

緑地（#0F5132）＋白の線画スマートフォンのマーク。マークはセーフゾーンを確保しているため maskable にも対応します。

---

## 手順（全4ステップ）

### 1. ファイルを配置
ZIP 内の PNG と `.webmanifest` を、**対象 HTML と同じフォルダ**に置きます。
**必ず HTTPS で配信**してください（`http://` や端末ローカルのファイルでは動作しません）。

### 2. 各 HTML の `</head>` 直前にタグを貼る

**S-MOBILE（モバイル管理 ＝ order_calendar_kashiwa_sato.html）** ※本ファイルには適用済み

```html
<link rel="manifest" href="s-mobile.webmanifest">
<meta name="theme-color" content="#0F5132">
<link rel="apple-touch-icon" href="s-mobile-icon-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="S-MOBILE">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

**SMART-AI（smart_ai.html）** — マニフェスト名・タイトル・アイコン名を差し替えるだけ

```html
<link rel="manifest" href="smart-ai.webmanifest">
<meta name="theme-color" content="#0F5132">
<link rel="apple-touch-icon" href="smart-ai-icon-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="SMART-AI">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

**SMART-EMS（smart_ems.html）**

```html
<link rel="manifest" href="smart-ems.webmanifest">
<meta name="theme-color" content="#0F5132">
<link rel="apple-touch-icon" href="smart-ems-icon-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="SMART-EMS">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

※ SMART-AI / SMART-EMS 用のアイコン・マニフェストは、本フォルダの S-MOBILE 用と同じ作り方
（各アプリのマークから 180 / 192 / 512 を書き出し、`name` と `short_name` を差し替え）で用意してください。

### 3. マニフェストの `start_url` を本番URLに合わせる
`s-mobile.webmanifest` の `start_url` を、配信する本番URLに変更します。

```json
"start_url": "https://example.com/order_calendar_kashiwa_sato.html",
"scope": "https://example.com/"
```

### 4. 利用者の追加方法
- **iPhone（Safari）**：共有ボタン → 「ホーム画面に追加」
- **Android（Chrome）**：︙メニュー → 「アプリをインストール」/「ホーム画面に追加」

---

## 動作確認のポイント
- HTTPS で配信されているか（必須）。
- `manifest` / `apple-touch-icon` / 各 PNG が HTML と同じ階層にあるか。
- iOS は `apple-touch-icon`（180px）を、Android は manifest の `icons`（192/512）を使用します。
- アイコンが更新されない場合は、一度ホーム画面から削除して再追加してください（キャッシュ対策）。
