---
title: Jujutsu megamerges for fun and profit
description: |
  A practical guide to creating and maintaining powerful megamerge workflows in
  Jujutsu for faster, conflict-free development.
tags: [jujutsu, megamerge, git, workflows]
reviewers:
  - display: msmetko
    link: https://terra-incognita.blog/
  - display: Cole Helbling
    link: https://github.com/cole-h
  - display: Hardy Jones
    link: https://github.com/joneshf
  - display: Alpha Chen
    link: https://git.kejadlen.dev/alpha
  - display: Jeremy Brown
  - display: Luke Randall
    link: https://hachyderm.io/@ldrndll
  - display: 789.ha
  - display: Philip Metzger
    link: https://philipmetzger.github.io/
publishedOn: 2026-02-05
isFeatured: true
---

_This article is written both for intermediate Jujutsu users and for Git users
who are curious about Jujutsu._

I'm a big [Jujutsu] user, and I've found myself relying more and more on
what we in the JJ community colloquially call the "megamerge" workflow for my
daily development. It's surprisingly under-discussed outside of a handful of
power users, so I wanted to share what that looks like and why it's so handy,
especially if you're in a complex dev environment or tend to ship lots of small
PRs.

[jujutsu]: https://jj-vcs.github.io/jj/latest

_In a hurry? [Skip to the end](#tldr) for some quick tips._

## Merge commits aren't what you think they are

If you're an average Git user (or even a Jujutsu user who hasn't dug too deep
into more advanced workflows), you may be surprised to learn that there is
absolutely nothing special about a merge commit. It's not some special case
that has its own rules. It's just a normal commit that has multiple parents. It
doesn't even have to be empty![^1]

<figure>

  ```ansi
  [1m[38;5;2m@[0m  [1m[38;5;13mmy[38;5;8mzpxsys[39m [38;5;3mIsaac Corbrey[39m [38;5;14m12 seconds ago[39m [38;5;12m6[38;5;8m34e82e2[39m[0m
  │  [1m[38;5;10m(empty)[39m [38;5;10m(no description set)[39m[0m
  ○    [1m[38;5;5mml[0m[38;5;8mlmtkmv[39m [38;5;3mIsaac Corbrey[39m [38;5;6m12 seconds ago[39m [38;5;2mgit_head()[39m [1m[38;5;4m9[0m[38;5;8m47a52fd[39m
  ├─╮  [38;5;2m(empty)[39m Merge the things
  │ ○  [1m[38;5;5mv[0m[38;5;8mqsqmtlu[39m [38;5;3mIsaac Corbrey[39m [38;5;6m12 seconds ago[39m [1m[38;5;4mf[0m[38;5;8m41c796e[39m
  │ │  deps: Pin quantum manifold resolver
  ○ │  [1m[38;5;5mt[0m[38;5;8mqqymrkn[39m [38;5;3mIsaac Corbrey[39m [38;5;6m19 seconds ago[39m [1m[38;5;4m04[0m[38;5;8m26baba[39m
  ├─╯  storage: Align transient cache manifolds
  [1m[38;5;14m◆[0m  [1m[38;5;5mz[0m[38;5;8mzzzzzzz[39m [38;5;2mroot()[39m [1m[38;5;4m00[0m[38;5;8m000000[39m
  ```

  <figcaption>Gotta put it all together!</figcaption>
</figure>

[^1]:
	In Git, merge commits that contain new changes outside of conflict
	resolution are called an "evil merge". Evil merges [aren't really "evil" in
	Jujutsu] since it has a more consistent model than Git.[^2]

	<figure>

    ```ansi
    Commit ID: [38;5;4mb976b2a9c6ebbaada7fcd9d112a8390f2cb75b54[39m
    Change ID: [38;5;5mtqxoxrwqqqtmxvywmzmspstupqqkskqk[39m
    Author   : [38;5;3mIsaac Corbrey[39m <[38;5;3misaac@isaaccorbrey.com[39m> ([38;5;6m28 minutes ago[39m)
    Committer: [38;5;3mIsaac Corbrey[39m <[38;5;3misaac@isaaccorbrey.com[39m> ([38;5;6m24 minutes ago[39m)
    Parent   : [1m[38;5;5mtt[0m[38;5;8mnyuntn[39m storage: Align transient cache manifolds
    Parent   : [1m[38;5;5mq[0m[38;5;8mupprxtz[39m ui: Defrobnicate layout heuristics

        io: Unjam polarity valves

    [38;5;3mAdded regular file two.txt:[39m
         [38;5;2m   1[39m: [4m[38;5;2m# Sphinx of black quartz, judge my vow[24m[39m
    ```
    
	  <figcaption>Bubble, bubble, toil and trouble.</figcaption>
	</figure>

	Definitely tangential, but I felt it necessary to mention.

[aren't really "evil" in Jujutsu]: https://jj-vcs.github.io/jj/latest/conflicts/#advantages

[^2]:
	Thanks to [Andrew Hoog] for helping me figure out footnotes in Astro. Did
	you know that you can reference footnotes from other footnotes?

[Andrew Hoog]: https://www.andrewhoog.com/posts/how-to-annotate-blog-posts-with-footnotes-in-astro

You may be even more surprised to learn that merge commits are not limited
to having two parents. We unofficially call merge commits with three or more
parents "octopus merges", and while you may be thinking to yourself "in what
world would I want to merge more than two branches?", this is actually a really
powerful idea. Octopus merges power the entire megamerge workflow!

## So what the hell is a megamerge?

Basically, in the megamerge workflow you are rarely working directly off the
tips of your branches. Instead, you create an octopus merge commit (hereafter
referred to as "the megamerge") as the child of every working branch you care
about. This means bugfixes, feature branches, branches you're waiting on PRs
for, other peoples' branches you need your code to work with, local environment
setup branches, even private commits that may not be or belong in any branch.
_Everything_ you care about goes in the megamerge. It's important to remember
that **you don't push the megamerge**, only the branches it composes.

<figure>

  ```ansi
  [1m[38;5;2m@[0m  [1m[38;5;13mmn[38;5;8mrxpywt[39m [38;5;3mIsaac Corbrey[39m [38;5;14m25 seconds ago[39m [38;5;12mf[38;5;8m1eb374e[39m[0m
  │  [1m[38;5;10m(empty)[39m [38;5;10m(no description set)[39m[0m
  ○      [1m[38;5;5mwu[0m[38;5;8mxuwlox[39m [38;5;3mIsaac Corbrey[39m [38;5;6m25 seconds ago[39m [38;5;2mgit_head()[39m [1m[38;5;4mc[0m[38;5;8m40c2d9c[39m
  ├─┬─╮  [38;5;2m(empty)[39m megamerge
  │ │ ○  [1m[38;5;5mtt[0m[38;5;8mnyuntn[39m [38;5;3mIsaac Corbrey[39m [38;5;6m57 seconds ago[39m [1m[38;5;4m7d[0m[38;5;8m656676[39m
  │ │ │  storage: Align transient cache manifolds
  │ ○ │  [1m[38;5;5mp[0m[38;5;8mtpvnsnx[39m [38;5;3mIsaac Corbrey[39m [38;5;6m25 seconds ago[39m [1m[38;5;4m8[0m[38;5;8m97d21c7[39m
  │ │ │  parser: Deobfuscate fleem tokens
  │ ○ │  [1m[38;5;5mzw[0m[38;5;8mpzvxmv[39m [38;5;3mIsaac Corbrey[39m [38;5;6m37 seconds ago[39m [1m[38;5;4m1[0m[38;5;8m4971267[39m
  │ │ │  infra: Refactor blob allocator
  │ ○ │  [1m[38;5;5mtq[0m[38;5;8mxoxrwq[39m [38;5;3mIsaac Corbrey[39m [38;5;6m57 seconds ago[39m [1m[38;5;4m9[0m[38;5;8m0bf43e4[39m
  │ ├─╯  io: Unjam polarity valves
  ○ │  [1m[38;5;5mmo[0m[38;5;8mslkvzr[39m [38;5;3mIsaac Corbrey[39m [38;5;6m50 seconds ago[39m [1m[38;5;4m75[0m[38;5;8m3ef2e7[39m
  │ │  deps: Pin quantum manifold resolver
  ○ │  [1m[38;5;5mq[0m[38;5;8mupprxtz[39m [38;5;3mIsaac Corbrey[39m [38;5;6m57 seconds ago[39m [1m[38;5;4m53[0m[38;5;8m32c1fd[39m
  ├─╯  ui: Defrobnicate layout heuristics
  ○  [1m[38;5;5mww[0m[38;5;8mtmlyss[39m [38;5;3mIsaac Corbrey[39m [38;5;6m57 seconds ago[39m [1m[38;5;4m58[0m[38;5;8m04d1fd[39m
  │  test: Add hyperfrobnication suite
  [1m[38;5;14m◆[0m  [1m[38;5;5mzz[0m[38;5;8mzzzzzz[39m [38;5;2mroot()[39m [1m[38;5;4m0[0m[38;5;8m0000000[39m
  ```
  
  <figcaption>Scary! Too much merge!</figcaption>
</figure>

It's okay if this sounds like a lot. After all, you know how much effort you
put into switching contexts if you have to revisit an old PR to get it reviewed,
among other things. However, this enables a few really valuable things for you:

1. **You are always working on the combined sum of all of your work.** This
   means that if your working copy compiles and runs without issue, you know
   that your work will all interact without issue.
2. **You rarely have to worry about merge conflicts.** You already don't need to
   worry about merge conflicts a ton since conflicts are a first-class concept
   in Jujutsu, but since you're literally always merging your changes together
   you'll never be struck with surprise merge conflicts on the forge side.
   There might be the occasional issue with contributors' changes, but in my
   experience this hasn't been a major problem.
3. **There's way less friction when switching between tasks.** Since you're
   always working on top of the megamerge, you never need to go to your VCS to
   switch tasks. You can just go edit what you need to. This also means it's way
   easier to make small PRs for drive-by refactors and bugfixes.
4. **It's easier to keep your branches up to date.** With a little magic, you
   can keep your entire megamerge up to date with your trunk branch with a
   single rebase command. I'll show you how to do that later on.

## How do I make one?

Starting a megamerge is super simple: just make a new commit with each branch
you want in the megamerge as a parent. I like to give that commit a name and
leave it empty, like so:

```sh
jj new x y z
jj commit --message "megamerge"
```

<figure>
  <script src="https://asciinema.org/a/791783.js" id="asciicast-791783" async="true"></script>

  <figcaption class="-mt-12 pt-3 w-full bg-bg-1 relative">
    Making megamerges. It's not so hard after all!
  </figcaption>
</figure>

You're then left with an empty commit on top of this whole thing. This is where
you do your work! Anything above the megamerge commit is considered WIP. You're
free to split things out as you need to, make multiple branches based on that
megamerge commit, whatever you want to do. Everything you write will be based on
the sum of everything within the megamerge, just like we wanted!

Of course, at some point you'll be happy with what you have, and you'll be left
wondering:

## How do I actually submit my changes?

How you get your WIP changes into your megamerge depends on where they need to
land. If you're making changes that should land in existing changes, you can
use the `squash` command with the `--to` flag to shuffle them into the right
downstream commits. If your commit contains multiple commits' worth of changes,
you can either `split` it out into multiple commits before squashing them or
(what I prefer) interactively squash with `squash --interactive` to just pick
out the specific pieces to move.

```sh
# Squash an entire WIP commit (defaults to `--from @`)
jj squash --to x --from y

# Interactively squash part of a WIP commit (defaults to `--from @`)
jj squash --to x --from y --interactive
```
<figure>
  <script src="https://asciinema.org/a/791782.js" id="asciicast-791782" async="true"></script>

  <figcaption class="-mt-12 pt-3 w-full bg-bg-1 relative">
    Hunk, I choose you!
  </figcaption>
</figure>

Of course, Jujutsu is a beautiful piece of software and has some automation for
this! The `absorb` command will do a lot of this for you by identifying which
downstream mutable commit each line or hunk of your current commit belong in and
**automatically squashing them down for you**. This feels like magic every time
I use it (and not the evil black box black magic kind of magic where nothing can
be understood), and it's one of the core pieces of Jujutsu's functionality that
make the megamerge workflow so seamless.

```sh
# Automagically autosquash your changes (defaults to `--from @`)
jj absorb --from x
```

<figure>
  <script src="https://asciinema.org/a/xYC1SQupOHOH2Y7i.js" id="asciicast-xYC1SQupOHOH2Y7i" async="true"></script>    

  <figcaption class="-mt-12 pt-3 w-full bg-bg-1 relative">
    Ope, that was fast.
  </figcaption>
</figure>

Absorbing won't always catch everything in your commit, but it'll usually get at
least 90% of your changes. The rest are either easily squashable downstream or
unrelated to any previous commit.

Conveniently, things aren't much more complicated if I have changes that belong
in a new commit. If the commit belongs in one of the branches I'm working on, I
can just rebase it myself and move the bookmark accordingly.

```sh
jj commit
jj rebase --revision x --after y --before megamerge
jj bookmark move --from y --to x
```

Let's break that rebase down to better understand how it works:

```ini
# We're gonna move some commits around!
jj rebase
    # Let's move our WIP commit(s) x...
    --revision x
        # so that they come after y (e.g. trunk())...
        --after y
            # and become a parent of the megamerge.
            --before megamerge ```

<figure>
  <script src="https://asciinema.org/a/954708.js" id="asciicast-954708" async="true"></script>

  <figcaption class="-mt-12 pt-3 w-full bg-bg-1 relative">
    A little bit of rocket surgery, as a treat.
  </figcaption>
</figure>

If I've started work on an entirely new feature or found an unrelated bug to
fix, then it's even simpler! Using a few aliases, I can super easily include new
changes in my megamerge:[^3]

[^3]:
	Aliases are a super powerful part of Jujutsu. There are two types you should
  look into: [revset aliases], which allow you to create custom functions which
  return one or more commits with the [revset language], and [command aliases],
  which let you extend Jujutsu's default functionality and add your own.

  There are also template aliases which let you change how Jujutsu logs to
  the terminal using the [templating language], and fileset aliases, which act
  similarly to revset aliases but act on files instead of revisions using the
  [fileset language].

[revset aliases]: https://jj-vcs.github.io/jj/latest/revsets/#aliases
[revset language]: https://jj-vcs.github.io/jj/latest/revsets
[command aliases]: https://jj-vcs.github.io/jj/latest/config/#aliases
[templating language]: https://docs.jj-vcs.dev/latest/templates
[fileset language]: https://docs.jj-vcs.dev/latest/filesets

```toml
[revset-aliases]
# Returns the closest merge commit to `to`
"closest_merge(to)" = "heads(::to & merges())"

[aliases]
# Inserts the given revset as a new branch under the megamerge.
stack = ["rebase", "--after", "trunk()", "--before", "closest_merge(@)", "--revision"]
```

Here's a quick explanation of what `closest_merge(to)` is actually doing:

```ini
heads(                 # Return only the topologically tip-most commit within...
      ::to             # the set of all commits that are ancestors of `to`...
           & merges()) # ...that are also merge commits.
```

Using that revset alias, `stack` lets us target any revset we want and insert it
between `trunk()` (your main development branch) and our megamerge commit:

```sh
jj stack x::y
```
<figure>
  <script src="https://asciinema.org/a/954709.js" id="asciicast-954709" async="true"></script>

  <figcaption class="-mt-12 pt-3 w-full bg-bg-1 relative">
    Whoa, that was neat!
  </figcaption>
</figure>

This is more useful if I have _multiple_ stacks of changes I want to include in
parallel; if it's just one, I have another alias that just gets the entire stack
of changes after the megamerge:

```toml
[aliases]
stage = ["stack", "closest_merge(@).. ~ empty()"]
```

```ini
closest_merge(@)..           # Return the descendants of the closest merge
                             # commit to the working copy...
                   ~ empty() # ...without any empty commits.
```

This one doesn't require any input! Just have your commits ready and stage 'em:

```sh
jj stage
```
<figure>
  <script src="https://asciinema.org/a/954710.js" id="asciicast-954710" async="true"></script>

  <figcaption class="-mt-12 pt-3 w-full bg-bg-1 relative">
    Wait, what? You can do that?
  </figcaption>
</figure>

The last missing piece of this megamerge puzzle is (unfortunately) dealing with
the reality that is _other people_:

## How do I keep all this crap up to date?

That's a great question, and one I spent a couple months trying to answer in
a general sense. Jujutsu has a really easy way of rebasing your entire working
tree onto your main branch:

```sh
jj rebase --onto trunk()
```

<figure>
  <script src="https://asciinema.org/a/954717.js" id="asciicast-954717" async="true"></script>

  <figcaption class="-mt-12 pt-3 w-full bg-bg-1 relative">
    Nice.
  </figcaption>
</figure>

However, this only works if your entire worktree is _your_ changes. When you try
to reference commits you don't own (like untracked bookmarks or other people's
branches) Jujutsu will stop early to protect them from being rewritten.[^4]

[^4]:
	Jujutsu has a concept of _mutable_ and _immutable_ commits, which basically
	dictates what commits you're allowed to modify on a normal basis. It's
	largely just a lint since you can override this with `--ignore-immutable`,
	but it's good at keeping you out of trouble. You can use the [`mutable()`
	and `immutable()` aliases] to select only mutable and immutable commits
	respectively.

[`mutable()` and `immutable()` aliases]: https://jj-vcs.github.io/jj/latest/revsets/#built-in-aliases

<figure>
  <script src="https://asciinema.org/a/954718.js" id="asciicast-954718" async="true"></script>

  <figcaption class="-mt-12 pt-3 w-full bg-bg-1 relative">
    Wait, not so nice. How do I do this?
  </figcaption>
</figure>

Let's fix that by rebasing only the commits we actually control. I struggled
with this one for a while, but thankfully the Jujutsu community is awesome.
Kudos to [Stephen Jennings] for coming up with this awesome revset:

[stephen jennings]: https://jennings.io

```toml
[aliases]
restack = ["rebase", "--onto", "trunk()", "--source", "roots(trunk()..) & mutable()"]
```

```ini
roots(                       # Get the furthest upstream commits...
      trunk()..)             # ...in the set of all descendants of ::trunk()...
                 & mutable() # ...and only return ones we're allowed to modify.
```

Rather than trying to rebase our entire working tree (like `jj rebase --onto
trunk()` tries to do), this alias only targets commits we're actually allowed to
move. This leaves behind branches that we don't control as well as work that's
stacked on top of other people's branches. It has yet to fail me, even with
monster ninefold mixed-contributor megamerges! (Say that five times fast.)

<figure>
  <script src="https://asciinema.org/a/954721.js" id="asciicast-954721" async="true"></script>

  <figcaption class="-mt-12 pt-3 w-full bg-bg-1 relative">
    There we go, that's better!
  </figcaption>
</figure>

## TL;DR

Jujutsu megamerges are super cool and let you work on many different streams of
work simultaneously. Read the whole article for an in-depth explanation of how
they work. For a super ergonomic setup, add these to your config with `jj config
edit --user`:

```toml
[revset-aliases]
"closest_merge(to)" = "heads(::to & merges())"

[aliases]
# `jj stack <revset>` to include specific revs
stack = ["rebase", "--after", "trunk()", "--before", "closest_merge(@)", "--revision"]

# `jj stage` to include the whole stack after the megamerge
stage = ["stack", "closest_merge(@).. ~ empty()"]

# `jj restack` to rebase your changes onto `trunk()`
restack = ["rebase", "--onto", "trunk()", "--source", "roots(trunk()..) & mutable()"]
```

Use `absorb` and/or `squash --interactive` to get new changes into existing
commits, `commit` and `rebase` to make new commits under your megamerge,
and `commit` with `stack` or `stage` to move entire branches into your
megamerge.[^5]

[^5]:
    If `restack` doesn't quite work the way you like, try incorporating [this
    config from Austin Seipp]. My default setup restacks every mutable commit in
    your repo, which behaves poorly when you have lots of mutable branches from
    the past you haven't had time to clean up yet.

    [this config from Austin Seipp]: https://github.com/thoughtpolice/a/blob/2f768e1b0407bc63d6dd01097ff1c5210e48d8f6/tilde/aseipp/dotfiles/jj/config.toml#L98-L104

    ```toml
    [revset-aliases]
    'stack()' = 'stack(@)'
    'stack(x)' = 'stack(x, 2)'
    'stack(x, n)' = 'ancestors(reachable(x, mutable()), n)'

    [aliases]
    restack = ["rebase", "--onto", "trunk()", "--source", "roots(trunk()..) & stack()"]
    ```

    Thanks for the tip Cole!


```sh
# Changes that belong in existing commits
jj absorb
jj squash --to x --interactive

# Changes that belong in new commits
jj rebase --revision y --after x

# Stack anything on top of the megamerge into it
jj stage

# Stack specific revsets into the megamerge
jj stack w::z
```

Remember that megamerges aren't really meant to be pushed to your remote;
they're just a convenient way of showing yourself the whole picture. You'll
still want to publish branches individually as usual.

<figure>
  <script src="https://asciinema.org/a/954722.js" id="asciicast-954722" async="true"></script>

  <figcaption class="-mt-12 pt-3 w-full bg-bg-1 relative">
    I live in this constantly, and you can too.
  </figcaption>
</figure>

Megamerges may not be everyone's cup of tea – I've certainly gotten a few
horrified looks after showing my working tree – but once you try them, you'll
likely find they let you bounce between tasks with almost no effort. Give them
a try!
