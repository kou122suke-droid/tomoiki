# design/

`site/index.html` の実装元となった Claude Design のエクスポート。
参照用に保存しているだけで、公開対象（`site/`）には含まれません。

- `トップページ デザイン.dc.html`

このファイルは Design Canvas 形式のため、`<x-dc>` / `<helmet>` /
`support.js` / `DCLogic` といったキャンバス専用の構造を含みます。
また、キャンバス上での編集によって付いた固定ピクセル指定
（例: `<section style="width: 975px; height: 663px">`）が残っており、
そのままブラウザで開くと崩れます。実装時にこれらを取り除いています。
