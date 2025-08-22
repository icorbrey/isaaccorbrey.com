---
title: "I'm tired of your bad READMEs."
description: |
    READMEs are one of the most important parts of onboarding new devs, but
    very rarely do we give them the attention they deserve.
tags: [documentation]
---

This is a heavily opinionated guide (and only kind of a rant) on how to write
an actually good README for your project. This, in my opinion, stems from
either a lack of care about documentation for future developers or a failure to
actually consider what future devs need when getting into your project. READMEs
are a vital part of developer onboarding and should be considered as important
as any other piece of developer tooling and ergonomics.

## What even is your project?

Too many READMEs wax on about different details of the project, but never
actually state in clear writing what the hell the project actually does or what
purpose it serves to users or the broader application network. Nix the essay
and just introduce your project in simple writing. One to three sentences is
best; if you feel like you're glossing over too many details, feel free to link
to wiki pages that dive deeper.

```diff
# FooBar

- FooBar is a blazingly fast, memory safe platform built with Tokio and Hyper
- to unlock fearless concurrency for your next-gen, cloud-native workflows. Now
- with optional `no_std` support and feature-gated SIMD pipelines!
+ FooBar is an async HTTP microservice (and crate) that extracts lightweight
+ image transforms out into a cached API. Request an image from a URL along
+ with your transforms (resize, crop, WebP/AVIF conversion, etc.), and FooBar
+ will cache the result in Redis and respond with the processed image.
+
+ Add `foobar = "0.3"` to your `Cargo.toml` when you need CDN-style image
+ optimization without handing assets to a third party.
```

## Don't get into the weeds

New devs likely don't care (and don't need to care) about the architectural
minutiae of your project. Unless your project has an awkward or complicated
architecture (or itself is an architectural tool), those pieces are best left
to a linked wiki page.

```diff
- ## Architecture
-
- At startup, PixieCache spins up a `hyper::Server` that wires a
- `Router<Arc<AppCtx>>` into a `Tokio` multi-thread runtime. The request path
- is dispatched to the `pipeline::ingest::parse_spec` state machine, which
- allocates an `OwnedSlice<u8>` buffer inside our custom bump-arena
- (`arena::SlabPool`). Each transform step implements the sealed
- `TransformStage` trait, with blanket impls behind the `simd` and `no_std`
- feature flags. Once the `ImageGraph` finishes, we hand the frame to
- `cache::redis::upsert_async`, which multiplexes its own `SocketPool` to avoid
- `EINPROGRESS` on TLS renegotiation...
- 
- <!-- 600 more words and a flowchart go here -->
+ ## How it works
+
+ FooBar is a thin Hyper/Tokio layer that:
+
+ 1. Fetches the requested source image,
+ 2. Pipes it through the requested transformation pipeline,
+ 3. Writes the result to Redis, and
+ 4. Streams the result back to the client.
+
+ See [ARCHITECTURE](./ARCHITECTURE.md) for the nitty gritty.
```

## Assume the environment is good

It is highly likely that devs new to your project are not new to your project's
tooling, especially if you're in a company with a lot of cross-functional devs.
When you're explaining how to get your project up and running, leave out common
details like "Make sure you have X language installed" and "You need to have Y
environment variable set for Z build tool to work". They're important pieces of
information, but put them in a common "How to set up your X dev environment"
that gets linked into READMEs for projects that need them rather than
duplicating the information at every turn.

`````diff
## Prerequisites

- ### Rust toolchain
-
- Make sure you have *exactly* rustc 1.77.0 and cargo 1.77.0
- nightly-2025-04-12. Install with:
-
- ```sh
- curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
- rustup install nightly-2025-04-12
- rustup default nightly-2025-04-12
- ```
-
- ### Redis
-
- Requires a local Redis instance on port 6379 with
- `maxmemory-policy allkeys-lru`.
-
- ### Environment variables
-
- ```sh
- export FOOBAR_REDIS_URL=redis://localhost
- export RUSTFLAGS='-Ctarget-cpu=native'
- export CARGO_NET_GIT_FETCH_WITH_CLI=true
- ```
-
- ### OpenSSL headers
-
- On MacOS, run the following:
-
- ```sh
- brew install openssl@3
- export OPENSSL_DIR=$(brew --prefix openssl@3)
- ```
-
- <!-- and so on and so on -->
+ FooBar builds with stable Rust 1.77+ and talks to Redis 6+. Make sure Redis
+ is running and you should be good to build from source.
+
+ Need help getting your environment up and running? See
+ [ONBOARDING](./ONBOARDING.md) to get started.
`````

## Include helpful links to related concepts

This is extra helpful when you're dealing with obscure or niche projects that
you don't expect new devs to have experience with. It probably won't answer
every question new devs will have, but it'll certainly help keep the obvious
ones out of your inbox.

```diff
+ ## Helpful links
+
+ - **Redis eviction policies**: https://redis.io/docs/latest/develop/reference/eviction/
+ - **WebP vs. AVIF tradeoffs**:
+   https://cloudinary.com/guides/image-formats/avif-vs-webp-4-key-differences-and-how-to-choose
+ - **Generating signed FooBar URLS**: See
+   [`examples/url_signing.rs`](./examples/url_signing.rs) and
+   https://www.ioriver.io/terms/signed-url
+
+ These resources answer about 90% of the "Wait, why does this work like this?"
+ questions we get from new contributors.
```

## Consider the project's lifecycle

Will your project be actively developed for the next couple years? Is it just a
connecting piece of infrastructure that gets touched when something goes wrong
or to support new functionality in projects that rely on it occasionally? Keep
your project's lifecycle in mind and include additional information that would
be useful in those contexts.

For example, a lot of projects I work on are touched maybe once a month to a
year, so when I work on them I update the README with a list of the people
still working at our company that should be the most helpful when you have
questions. [This Git one-liner][git-committers] has been fantastic for sourcing
this information.

[git-committers]: https://stackoverflow.com/a/20414465/6719672
