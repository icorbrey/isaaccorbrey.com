set shell := ["bash", "-Eeu", "-o", "pipefail", "-c"]

render:
    scripts/render-tapes.sh

build:
    pnpm install --frozen-lockfile
    pnpm run build

clean:
    rm -rf public/demos .cache/vhs
