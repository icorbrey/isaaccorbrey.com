#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
TAPE_ROOT="$ROOT_DIR/src/tapes"
CACHE_ROOT="$ROOT_DIR/.cache/vhs"
OUTPUT_ROOT="$ROOT_DIR/public/demos"

if ! command -v vhs >/dev/null 2>&1; then
  echo "vhs is required but not installed" >&2
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required but not installed" >&2
  exit 1
fi

mkdir -p "$CACHE_ROOT" "$OUTPUT_ROOT"

shopt -s nullglob
mapfile -t TAPES < <(find "$TAPE_ROOT" -type f -name '*.tape' | sort)
shopt -u nullglob

if [[ ${#TAPES[@]} -eq 0 ]]; then
  echo "No .tape files found under src/tapes"
  exit 0
fi

compute_hash() {
  local tape_path="$1"
  local slug_dir
  slug_dir=$(dirname "$tape_path")
  local fixtures_dir="$slug_dir/fixtures"

  {
    sha256sum "$tape_path" | cut -d ' ' -f1
    # Optional fixtures support: if a tape ships extra files (input data,
    # expect scripts, etc.) hash them too so cache invalidates correctly.
    if [[ -d "$fixtures_dir" ]]; then
      find "$fixtures_dir" -type f -print0 |
        sort -z |
        while IFS= read -r -d '' fixture; do
          sha256sum "$fixture" | cut -d ' ' -f1
        done
    fi
  } | sha256sum | cut -d ' ' -f1
}

restore_from_cache() {
  local cache_dir="$1"
  local output_dir="$2"
  local stem="$3"

  local restored=false
  for ext in webm mp4 webp; do
    local cached_file="$cache_dir/$stem.$ext"
    if [[ -f "$cached_file" ]]; then
      mkdir -p "$output_dir"
      cp "$cached_file" "$output_dir/$stem.$ext"
      restored=true
    else
      restored=false
      break
    fi
  done

  [[ "$restored" == true ]]
}

for tape in "${TAPES[@]}"; do
  slug=$(basename "$(dirname "$tape")")
  stem=$(basename "$tape" .tape)

  output_dir="$OUTPUT_ROOT/$slug"
  cache_dir="$CACHE_ROOT/$slug/$stem"
  hash_file="$cache_dir/hash"

  mkdir -p "$cache_dir"

  tape_hash=$(compute_hash "$tape")

  if [[ -f "$hash_file" && "$tape_hash" == "$(<"$hash_file")" ]]; then
    if restore_from_cache "$cache_dir" "$output_dir" "$stem"; then
      echo "Skipping $slug/$stem (cached)"
      continue
    fi
    echo "Cache missing outputs for $slug/$stem, re-rendering"
  else
    echo "Rendering $slug/$stem"
  fi

  tmpdir=$(mktemp -d "$cache_dir/.tmp.XXXXXX")
  cleanup() {
    rm -rf "$tmpdir"
  }
  trap cleanup EXIT

  webm_tmp="$tmpdir/$stem.webm"
  mp4_tmp="$tmpdir/$stem.mp4"
  poster_tmp="$tmpdir/$stem.webp"

  if ! vhs --output "$webm_tmp" < "$tape"; then
    echo "vhs failed for $tape" >&2
    exit 1
  fi

  if ! ffmpeg -y -i "$webm_tmp" -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart "$mp4_tmp" >/dev/null 2>&1; then
    echo "ffmpeg failed to create mp4 for $tape" >&2
    exit 1
  fi

  if ! ffmpeg -y -i "$webm_tmp" -frames:v 1 "$poster_tmp" >/dev/null 2>&1; then
    echo "ffmpeg failed to create poster for $tape" >&2
    exit 1
  fi

  mkdir -p "$output_dir"
  cp "$webm_tmp" "$output_dir/$stem.webm"
  cp "$mp4_tmp" "$output_dir/$stem.mp4"
  cp "$poster_tmp" "$output_dir/$stem.webp"

  cp "$webm_tmp" "$cache_dir/$stem.webm"
  cp "$mp4_tmp" "$cache_dir/$stem.mp4"
  cp "$poster_tmp" "$cache_dir/$stem.webp"

  echo "$tape_hash" > "$hash_file"

  cleanup
  trap - EXIT

done
