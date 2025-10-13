---
title: Jujutsu megamerges for fun and profit
description: |
  TK
tags: [jujutsu, git, workflows]
reviewers:
  - display: msmetko
    link: https://terra-incognita.blog/
  - display: Cole Helbling
    link: https://github.com/cole-h
  - display: Alpha Chen
    link: https://git.kejadlen.dev/alpha
  - display: Luke Randall
    link: https://hachyderm.io/@ldrndll
publishedOn: 2025-10-08
---

I'm a big [Jujutsu] user, and I've found myself relying more and more on what
we colloquially call the "megamerge" workflow for my daily development. It's
surprisingly under-discussed outside of a handful of power users, so I wanted
to share what that looks like and why it's so handy, especially if you're in a
complex dev environment or tend to ship lots of small PRs.

[jujutsu]: https://jj-vcs.github.io/jj/latest

### Merge commits aren't what you think they are

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
	resolution are called an "evil merge". Evil merges aren't really "evil" in
	Jujutsu since it has a more consistent model than Git, but I felt it necessary
	to mention.[^2]

	<figure>
	  TK asciinema of evil merge
	  <figcaption>Bubble bubble, toil and trouble.</figcaption>
	</figure>

[^2]: Thanks to [Andrew Hoog] for helping me figure out footnotes in Astro. Did
you know that you can reference footnotes from other footnotes?

[andrew hoog]: https://www.andrewhoog.com/posts/how-to-annotate-blog-posts-with-footnotes-in-astro

You may be even more surprised to learn that merge commits are not limited
to having two parents. We unofficially call merge commits with three or more
parents "octopus merges", and while you may be thinking to yourself "in what
world would I want to merge more than two branches?", this is actually a really
powerful idea.

<figure>
  TK asciinema of making octopus merge
  <figcaption>Calamari! Wait, that's squid.</figcaption>
</figure>

### So what the hell is a megamerge?

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
   switch tasks. You can just go edit what you need to. This also means **it's
   way easier to make small PRs for drive-by refactors and bugfixes.**
4. **It's easier to keep your branches up to date.** With a little magic, you
   can keep your entire megamerge up to date with your trunk branch with a
   single rebase command. I'll show you how to do that later on.

### How do I make one?

Starting a megamerge is super simple: just make a new commit with each branch
you want in the megamerge as a parent. I like to give that commit a name and
leave it empty, like so:

<figure>
	TK asciinema of creating megamerge
	<figcaption>Making megamerges. It's not so hard after all!</figcaption>
</figure>

Now you can make new changes on top! What I typically do is make a set of
changes and test them out. If I'm happy with them, I use the ingenious `jj
absorb` command to **instantly and magically squash my changes into the
right commits per hunk**. This command is one of the core pieces of Jujutsu's
functionality that makes the megamerge workflow so seamless.

<figure>
	TK asciinema of absorbing changes
	<figcaption>That was easier than expected.</figcaption>
</figure>

This works great! But of course, development never really stands still, and
new work is always sneaking in. You can only get so far before you run into a
big question:

### How do I get _new_ changes into this thing?

If I've `absorb`ed and still have changes left over, that means one of
two things. Usually, it's because I have changes that belong in one of my
existing commits (maybe I added an import and that wasn't caught by `absorb`'s
heuristics); in this case, I can just manually squash my changes (which usually
is now just a few lines) into the correct commit.

<figure>
	TK asciinema of manual squash after incomplete absorb
	<figcaption>Wait, what do I do with this?</figcaption>
</figure>

Conveniently, things aren't much more complicated if I have changes that belong
in their own commit. If the commit belongs in one of the branches I'm working
on, I can just rebase it myself and move the bookmark accordingly.

<figure>
	TK asciinema of commit, rebase, and bookmark move
	<figcaption>A little bit of rocket surgery, as a treat.</figcaption>
</figure>

If I've started work on an entirely new feature or found an unrelated bug to
fix, then it's even simpler! Using a few aliases, I can super easily include new
changes in my megamerge:

```toml
revset-aliases."closest_merge(to)" = "heads(::to & merges())"
aliases.stack = ["rebase", "-A", "trunk()", "-B", "closest_merge(@)", "-r"]
```

If you're unfamiliar with aliases, they let you customize Jujutsu to do pretty
much whatever you want. Here, we're creating a revset alias that gets the
closest ancestor of `to` that's a merge commit – which with our workflow is
nearly always the megamerge commit – then using that to insert whatever we want
to `stack` between our megamerge commit and `trunk()` (which gets set when you
clone a repo with Jujutsu, usually it's your main development branch).

<figure>
	TK asciinema stack demo
	<figcaption>Whoa, that was neat!</figcaption>
</figure>

This is more useful if I have _multiple_ stacks of changes I want to include in
parallel; if it's just one, I have another alias that just gets the entire stack
of changes after the megamerge:

```toml
aliases.stage = ["stack", "closest_merge(@)+:: ~ empty()"]
```

<figure>
	TK asciinema stage demo
	<figcaption>Wait, what? You can do that?</figcaption>
</figure>

The last missing piece of this megamerge puzzle is (unfortunately) dealing with
the reality that is _other people_:

### How do I keep all this crap up to date?

That's a great question, and one I spent a couple months trying to answer in
a general sense. Jujutsu has a really easy way of rebasing your entire working
tree onto your main branch:

<figure>
	TK asciinema of jj rebase -d trunk()
	<figcaption>Nice.</figcaption>
</figure>

However, this only works if your entire worktree is _your_ changes. Once you
start bringing immutable changes (e.g. untracked bookmarks, other people's
changes, maybe you're even stacking your own changes on top of other people's
branches) this starts to break down, since you can't rebase immutable commits
without an override (and shouldn't, since you'd be rewriting history you don't
own).

<figure>
	TK asciinema of jj rebase -d trunk() failing for immutable stuff
	<figcaption>Wait, not so nice. How do I do this?</figcaption>
</figure>

Thankfully, the Jujutsu community is awesome, and ultimately [Stephen Jennings]
came up with this awesome alias:

[stephen jennings]: https://jennings.io

```toml
aliases.restack = ["rebase", "-d", "trunk()", "-s", "roots(trunk()..) & mutable()"]
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

### TL;DR

Jujutsu megamerges are super cool and let you work on many different streams of
work simultaneously. Read the whole article for an in-depth explanation of how
they work. For a super ergonomic setup, add these to your config with `jj config
edit --user`:

```toml
[revset-aliases]
"closest_merge(to)" = "heads(::to & merges())"

[aliases]
# `jj stack <revset>` to include specific revs
stack = ["rebase", "-A", "trunk()", "-B", "closest_merge(@)", "-r"]

# `jj stage` to include the whole stack after the megamerge
stage = ["stack", "closest_merge(@)+:: ~ empty()"]

# `jj restack` to rebase your changes onto `trunk()`
restack = ["rebase", "-d", "trunk()", "-s", "roots(trunk()..) & mutable()"]
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
