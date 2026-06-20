# 7_商品マスタ管理 — モックアップ

SO / SS 両系の商品マスタ管理画面（`/productmastermanagement/`）を静的HTMLモックアップとして収録。

## ファイル

| ファイル | 説明 | 本番URL |
|---|---|---|
| `so_product_master.html` | SMART ORDER 商品マスタ管理 | https://vgt-smart-order-prod.azurewebsites.net/productmastermanagement/ |
| `ss_product_master.html` | SMART STOCK 商品マスタ管理 | https://vgt-smart-stock-prod.azurewebsites.net/productmastermanagement/ |

## 差分（SO vs SS）

| 項目 | SO（受注） | SS（仕入） |
|---|---|---|
| テーマカラー | `#0F5132`（緑） | `#1A3A63`（紺） |
| ラベル | 受注 · SMART ORDER | 仕入 · SMART STOCK |

## 動作確認（ローカル）

ファイルをブラウザで直接開くだけで動作します（サーバー不要）。  
CDN依存: Tailwind CSS Play CDN / Font Awesome CDN / Alpine.js CDN / jQuery CDN

## モックアップ仕様

- Django テンプレートタグ（`{% %}` / `{{ }}`）は除去済み
- AJAX API 呼び出しはサンプルデータに置換済み（読み取り・UI 操作は動作する）
- CSV ダウンロード / アップロードは無効（`alert()` に置換）
- 「戻る」ボタンのリンクは `#`（遷移なし）
- 新規登録・表示/非表示切替・メーカー追加/修正/削除はモック動作（ページ内メモリのみ）

## 変換元テンプレート

- `vgt-smart-order-system/app/templates/product_master_management.html`
- `vgt-smart-stock/app/templates/product_master_management.html`
