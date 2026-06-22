---
render_with_liquid: false
---

# 9_SS-仕入管理 — モックアップ

SMART STOCK 仕入管理画面のメニューボタン各遷移先を、スタンドアロン HTML モックアップとして収録。

## フォルダ構成 / ボタン対応表

| フォルダ名 | ボタン名 | 変換元テンプレート | 本番 URL (相対) |
|---|---|---|---|
| `仕入入力/` | 仕入入力 | `order_input.html` | `/order_input/` |
| `仕入指示書/` | 仕入指示書 | `packaging_printing.html` | `/packaging_printing/` |
| `仕入集計/` | 仕入集計 | `sale_summary.html` | `/sale_summary/` |
| `見積依頼書(原価管理)/` | 見積依頼書(原価管理) | `quotation_pricing.html` | `/quotation_pricing/` |
| `支払明細印刷/` | 支払明細印刷 | `invoice.html` | `/invoice_printing/` |
| `特別集計/` | 特別集計 | `special_tabulation.html` | `/special_tabulation/` |
| `一括単価変更/` | 一括単価変更 | `unit_price_fix.html` | `/unit_price_fix/` |
| `テナント管理/` | テナント管理（ヘッダー） | `tenant_restriction.html` | `/tenant_restriction/` |
| `モバイルオーダー/` | モバイルオーダー（ヘッダー） | `mobile_order_management.html` | `/mobile_order_management/` |
| `設定/` | 設定（ヘッダー） | `admin_cp.html` | `/admin_cp/` |

> 商品マスタは `7_商品マスタ管理/` に既収録のため本フォルダには含まない。

## 動作確認

ファイルをブラウザで直接開くだけで表示されます（サーバー不要）。  
依存 CDN: Tailwind CSS Play CDN / Font Awesome / Bootstrap Icons / Alpine.js / jQuery

## 変換仕様

| 項目 | 変換内容 |
|---|---|
| Django テンプレートタグ | `{% url %}` → `#`、`{% csrf_token %}` → 削除 |
| 静的ファイル | `{% static %}` → `#` |
| テンプレート変数 | `{{ term_product }}` → `商品`、`{{ term_label }}` → `ラベル` |
| カスタムカラー `primary-*` | CSS クラスで直接定義（ネイビー系 `#1A3A63` / ティール系 `#0d7369`） |
| AJAX 呼び出し | スタブ化（コンソールログまたはサンプルデータ返却） |
| `for` ループ | サンプル1件を直接 HTML に展開 |

## 変換元リポジトリ

`vgt-smart-stock/app/templates/`
