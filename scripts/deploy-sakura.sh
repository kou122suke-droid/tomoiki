#!/usr/bin/env bash
#
# さくらのレンタルサーバへ dist/ を同期する。
#
#   使い方:
#     cp .env.sakura.example .env.sakura   # 初回のみ。中身を自分の値に書き換える
#     npm run build
#     ./scripts/deploy-sakura.sh           # 差分だけ転送
#     ./scripts/deploy-sakura.sh --dry-run # 転送せず内容だけ確認
#
#   SSH（rsync）はスタンダードプラン以上で利用できます。
#   ライトプランは SSH 非対応のため、METHOD=ftp を指定してください（lftp が必要）。
#
set -euo pipefail

cd "$(dirname "$0")/.."

ENV_FILE="${ENV_FILE:-.env.sakura}"
if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
else
  echo "設定ファイル $ENV_FILE がありません。.env.sakura.example をコピーして作成してください。" >&2
  exit 1
fi

: "${SAKURA_USER:?SAKURA_USER（FTP/SSHアカウント名）を設定してください}"
: "${SAKURA_HOST:?SAKURA_HOST（例: example.sakura.ne.jp）を設定してください}"
: "${SAKURA_PATH:?SAKURA_PATH（例: /home/example/www）を設定してください}"
METHOD="${METHOD:-ssh}"

if [[ ! -d dist ]]; then
  echo "dist/ がありません。先に npm run build を実行してください。" >&2
  exit 1
fi

DRY=""
[[ "${1:-}" == "--dry-run" ]] && DRY="1"

echo "転送先: ${SAKURA_USER}@${SAKURA_HOST}:${SAKURA_PATH}  (method=${METHOD})"

if [[ "$METHOD" == "ssh" ]]; then
  # --delete でサーバ側の余分なファイルも消す（公開ディレクトリを dist と一致させる）
  ARGS=(-avz --delete --checksum)
  [[ -n "$DRY" ]] && ARGS+=(--dry-run)
  rsync "${ARGS[@]}" \
    -e "ssh -p ${SAKURA_PORT:-22}" \
    dist/ "${SAKURA_USER}@${SAKURA_HOST}:${SAKURA_PATH}/"
else
  command -v lftp >/dev/null || { echo "lftp が必要です（brew install lftp / apt install lftp）" >&2; exit 1; }
  : "${SAKURA_PASS:?FTPの場合は SAKURA_PASS も設定してください}"
  MIRROR="mirror --reverse --delete --verbose --parallel=4"
  [[ -n "$DRY" ]] && MIRROR="$MIRROR --dry-run"
  # FTPS（明示的TLS）で接続する
  lftp -c "
    set ftp:ssl-force true;
    set ftp:ssl-protect-data true;
    set ssl:verify-certificate true;
    open -u '${SAKURA_USER}','${SAKURA_PASS}' '${SAKURA_HOST}';
    $MIRROR dist/ '${SAKURA_PATH}/';
  "
fi

echo "完了しました。"
