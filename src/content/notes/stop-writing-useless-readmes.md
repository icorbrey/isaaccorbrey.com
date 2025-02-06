---
title: "Stop writing useless READMEs."
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

## Don't get into the weeds

New devs likely don't care (and don't need to care) about the architectural
minutiae of your project. Unless your project has an awkward or complicated
architecture (or itself is an architectural tool), those pieces are best left
to a linked wiki page.

## Assume the environment is good

It is highly likely that devs new to your project are not new to your project's
tooling, especially if you're in a company with a lot of cross-functional devs.
When you're explaining how to get your project up and running, leave out common
details like "Make sure you have X language installed" and "You need to have Y
environment variable set for Z build tool to work". They're important pieces of
information, but put them in a common "How to set up your X dev environment"
that gets linked into READMEs for projects that need them rather than
duplicating the information at every turn.

## Include helpful links to related concepts

This is extra helpful when you're dealing with obscure or niche projects that
you don't expect new devs to have experience with. It probably won't answer
every question new devs will have, but it'll certainly help keep the obvious
ones out of your inbox.

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
