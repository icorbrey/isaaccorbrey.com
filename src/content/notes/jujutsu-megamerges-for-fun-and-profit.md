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
publishedOn: 2025-10-08
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

_In a hurry? [Skip to the end](#TL;DR) for some quick tips._

<!-- FEEDBACK: Several folks suggested surfacing a TL;DR near the top. You’ve
linked it here—nice. If you add a tiny asciinema teaser beside/under this link
later, it may increase engagement. -->

## Merge commits aren't what you think they are

If you're a normal Git user (or even a Jujutsu user who hasn't dug too deep into
more advanced workflows), you may be surprised to learn that there is absolutely
nothing special about a merge commit. It's not some special case that has its
own rules. It's just a normal commit that has multiple parents. It doesn't even
have to be empty![^1]

<figure>
  TK asciinema of log output
  <figcaption>A big scary megamerge.</figcaption>
</figure>

[^1]:
	In Git, merge commits that contain new changes outside of conflict
	resolution are called an "evil merge". Evil merges [aren't really "evil" in
	Jujutsu] since it has a more consistent model than Git.[^2]

	<figure>
	  TK asciinema of making an evil merge
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

<!--
#!/usr/bin/expect
set timeout 1
set send_human {0.08 0.18 0.02 0.02 0.5}

set PROMPT "$ "
set CTRLC \003
set ESC \033

proc expect_prompt {} {
  expect -exact $PROMPT
}

proc type {text} {
  send -h "$text"
}

proc run {command} {
  type "$command"
  sleep 3
  send "\r"
  expect -timeout 1
}

proc keystroke {key {addl_sleep 2}} {
  send "$key"
  expect -timeout 1
  sleep $addl_sleep
}

proc jj_capture_by_desc {desc} {
  set out [exec jj log -r [format {description(exact:"%s")} $desc] -T {change_id.shortest(1) \n}]
  return [string trim $out]
}

set LOG_1 "ui: Defrobnicate layout heuristics"
set LOG_2 "network: Recalibrate flux capacitor"
set LOG_3 "auth: Hydrate session holograms"

log_user 0
send -- "jj commit -m '$LOG_1'"
send -- "jj commit -m '$LOG_2'"
send -- "jj commit -m '$LOG_3'"
send -- "jj parallelize -r '@---::@-'"
send -- "clear"
log_user 1

spawn asciinema rec
expect_prompt

run "jj"


send "exit"
-->

<figure>
  TK asciinema of making octopus merge
  <figcaption>Calamari! Wait, that's squid.</figcaption>
</figure>

## So what the hell is a megamerge?

Basically, in the megamerge workflow you are rarely working directly off the
tips of your branches. Instead, you create an octopus merge commit (hereafter
referred to as "the megamerge") as the child of every working branch you care
about. This means bugfixes, feature branches, branches you're waiting on PRs
for, other peoples' branches you need your code to work with, local environment
setup branches, even private commits that may not be or belong in any branch.
_Everything_ you care about goes in the megamerge.

<figure>
  TK asciinema log output of example big megamerge
  <figcaption>Another big megamerge. Maybe not so scary?</figcaption>
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

<!-- FEEDBACK: Some felt this benefits list reads like a wrap-up. You might
consider moving it after a concrete demo, but if you keep it here, you’re
fine—the intro already motivates “why.” -->

## How do I make one?

Starting a megamerge is super simple: just make a new commit with each branch
you want in the megamerge as a parent. I like to give that commit a name and
leave it empty, like so:

<!-- FEEDBACK: Readers asked for literal commands alongside video. Consider a
short code block here showing a realistic `jj new <branch1> <branch2> ...; jj
commit -m "megamerge"` example. -->

```sh
jj new x y z
jj commit -m "megamerge"
```

<figure>
  TK asciinema of creating megamerge
  <figcaption>Making megamerges. It's not so hard after all!</figcaption>
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
land. If you're making changes that should land in existing changes, you can use
the `squash` command to shuffle them into the right downstream commits. If your
commit contains multiple commits' worth of changes, you can either `split` it
out into multiple commits before squashing them or (what I prefer) interactively
squash with `squash -i` to just pick out the specific pieces to move.

```sh
# Squash an entire WIP commit (defaults to `-f @`)
jj squash -t x -f y

# Interactively squash part of a WIP commit (defaults to `-f @`)
jj squash -i -f x -t y
```

<figure>
  TK asciinema of manual interactive squashing
  <figcaption>Hunk, I choose you!</figcaption>
</figure>

Of course, Jujutsu is a beautiful piece of software and has some automation for
this! The `absorb` command will do a lot of this for you by identifying which
downstream mutable commit each line or hunk of your current commit belong in and
**automatically squashing them down for you**. This feels like magic every time
I use it (and not the evil black box black magic kind of magic where nothing can
be understood), and it's one of the core pieces of Jujutsu's functionality that
make the megamerge workflow so seamless.

```sh
# Automagically autosquash your changes (defaults to `-f @`)
jj absorb -f x
```

<figure>
  TK asciinema of absorbing changes
  <figcaption>Ope, that was fast.</figcaption>
</figure>

Absorbing won't always catch everything in your commit, but it'll usually get at
least 90% of your changes. The rest are either easily squashable downstream or
unrelated to any previous commit.

Conveniently, things aren't much more complicated if I have changes that belong
in a new commit. If the commit belongs in one of the branches I'm working on, I
can just rebase it myself and move the bookmark accordingly.

```sh
jj commit
jj rebase -r x -A y -B megamerge
jj bookmark move -f y -t x
```

<figure>
  TK asciinema of commit, rebase, and bookmark move
  <figcaption>A little bit of rocket surgery, as a treat.</figcaption>
</figure>

If I've started work on an entirely new feature or found an unrelated bug to
fix, then it's even simpler! Using a few aliases, I can super easily include new
changes in my megamerge:[^3]

[^3]:
	Aliases are a super powerful part of Jujutsu. There are two types: [revset
	aliases], which allow you to create custom functions which return one or more
	commits with the [revset language], and [command aliases], which let you extend
	Jujutsu's default functionality and add your own.

[revset aliases]: https://jj-vcs.github.io/jj/latest/revsets/#aliases
[revset language]: https://jj-vcs.github.io/jj/latest/revsets
[command aliases]: https://jj-vcs.github.io/jj/latest/config/#aliases

```toml
[revset-aliases]
# Returns the closest merge commit to `to`
"closest_merge(to)" = "heads(::to & merges())"

[aliases]
# Inserts the given revset as a new branch under the megamerge.
stack = ["rebase", "-A", "trunk()", "-B", "closest_merge(@)", "-r"]
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
  TK asciinema stack demo
  <figcaption>Whoa, that was neat!</figcaption>
</figure>

This is more useful if I have _multiple_ stacks of changes I want to include in
parallel; if it's just one, I have another alias that just gets the entire stack
of changes after the megamerge:

```toml
[aliases]
stage = ["stack", "closest_merge(@).. ~ empty()"]
```

```ini
closest_merge(@)..           # Return the children of the closest merge commit
                             # to the working copy...
                   ~ empty() # ...without any empty commits.
```

This one doesn't require any input! Just have your commits described and ready,
then stage 'em:

```sh
jj stage
```

<figure>
  TK asciinema stage demo
  <figcaption>Wait, what? You can do that?</figcaption>
</figure>

The last missing piece of this megamerge puzzle is (unfortunately) dealing with
the reality that is _other people_:

## How do I keep all this crap up to date?

That's a great question, and one I spent a couple months trying to answer in
a general sense. Jujutsu has a really easy way of rebasing your entire working
tree onto your main branch:

```sh
jj rebase -d trunk()
```

<figure>
  TK asciinema of jj rebase -d trunk()
  <figcaption>Nice.</figcaption>
</figure>

<!-- FEEDBACK: Consider noting that this simple rebase assumes you control
(mutable) commits; sets the stage for why the alias is needed. -->

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

<!-- FEEDBACK: Good explanation of immutability. A small diagram (mutable
islands vs. immutable) could help visualize what “gets left behind.” -->

<figure>
  TK asciinema of jj rebase -d trunk() failing for immutable stuff
  <figcaption>Wait, not so nice. How do I do this?</figcaption>
</figure>

Let's fix that by rebasing only the commits we actually control. I struggled
with this one for a while, but thankfully the Jujutsu community is awesome.
Kudos to [Stephen Jennings] for coming up with this awesome revset:

[stephen jennings]: https://jennings.io

```toml
[aliases]
restack = ["rebase", "-d", "trunk()", "-s", "roots(trunk()..) & mutable()"]
```

```ini
roots(                       # Get the furthest upstream commits...
      trunk()..)             # ...in the set of all descendants of trunk()...
                 & mutable() # ...and only return ones we're allowed to modify.
```

Rather than trying to rebase our entire working tree (like `jj rebase -d
trunk()` tries to do), this alias only targets commits we're actually allowed to
move. This leaves behind branches that we don't control as well as work that's
stacked on top of other people's branches. It has yet to fail me, even with
monster ninefold mixed-contributor megamerges! (Say that five times fast.)

<figure>
  TK asciinema jj restack working on previous example
  <figcaption>There we go, that's better!</figcaption>
</figure>

## TL;DR

Jujutsu megamerges are super cool and let you work on many different streams of
work simultaneously. Read the whole article for an in-depth explanation of how
they work. For a super ergonomic setup, add these to your config with `jj config
edit --user`:

<!-- FEEDBACK: Consider adding a tiny “when to use megamerge vs. not” bullet
(teams unfamiliar with JJ, repos with heavy CI constraints, etc.) for pragmatic
guidance. -->

```toml
[revset-aliases]
"closest_merge(to)" = "heads(::to & merges())"

[aliases]
# `jj stack <revset>` to include specific revs
stack = ["rebase", "-A", "trunk()", "-B", "closest_merge(@)", "-r"]

# `jj stage` to include the whole stack after the megamerge
stage = ["stack", "closest_merge(@).. ~ empty()"]

# `jj restack` to rebase your changes onto `trunk()`
restack = ["rebase", "-d", "trunk()", "-s", "roots(trunk()..) & mutable()"]
```

<!-- FEEDBACK: Great that the TL;DR uses TOML sections—this matches reader
preference. If space allows, add one example call (e.g., `jj stage`) under the
block for quick copy/try. -->

Use `absorb` and/or `squash -i` to get new changes into existing commits,
`commit` and `rebase` to make new commits under your megamerge, and `commit`
with `stack` or `stage` to move entire branches into your megamerge.

```sh
# Changes that belong in existing commits
jj absorb
jj squash -i -t x

# Changes that belong in new commits
jj rebase -r y -A x

# Stack anything on top of the megamerge into it
jj stage

# Stack specific revsets into the megamerge
jj stack w::z
```

Remember that megamerges aren't really meant to be pushed to your remote;
they're just a convenient way of showing yourself the whole picture. You'll
still want to publish branches individually as usual.

<figure>
  TK asciinema whole megamerge flow, should reflect how I actually use it
  <figcaption>I live in this constantly, and you can too.</figcaption>
</figure>

Megamerges may not be everyone's cup of tea – I've certainly gotten a few
horrified looks after showing my working tree – but once you try them, you'll
likely find they let you bounce between tasks with almost no effort. Give them
a try!
