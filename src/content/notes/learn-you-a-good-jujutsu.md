---
title: "Learn you a good Jujutsu"
description: |
  Learn how to use Jujutsu, a simple yet powerful version control system that's
  compatible with Git.
tags: [jujutsu, version-control]
videoUrl: https://www.youtube.com/embed/dQw4w9WgXcQ?si=ar0pEZ0ftpLj4zyD
---

I have not touched Git since March of this year. This is not because of some
horrible accident where I'm unable to work, nor have I eschewed keeping my work
in version control altogether. It's because that's the moment I started using
[Jujutsu][1].

[1]: https://jj-vcs.github.io/jj/latest

You're probably busy, so I'll give you the TL;DR up front. Jujutsu is a version
control system that builds upon lessons learned from decades of folks using Git,
Mercurial, and other tools to give you a better user experience for managing
your changes. It's compatible with Git and can even be used alongside a real
on-disk Git repo, so you don't need to give up your favorite forge or your
trusty local tooling (looking at you Magit users). It keeps a log of the changes
you make to your history and lets you easily roll back any mistakes, so you can
feel safe to experiment with commands.

Still interested? I was.

Go ahead and [install Jujutsu][2]. You'll probably want to [set up dynamic
completions][3] for your shell, and if you're looking for it you can find the
config at `~/.config/jj/config.toml`. This global configuration can be
overridden per repo in `.jj/repo/config.toml`. See the [config reference][4] for
more details. Finally, set your name and email:

[2]: https://jj-vcs.github.io/jj/latest/install-and-setup/
[3]: https://jj-vcs.github.io/jj/latest/install-and-setup/#command-line-completion
[4]: https://jj-vcs.github.io/jj/latest/config/

```sh
jj config set --user user.name "Isaac Corbrey"
jj config set --user user.email "me@isaaccorbrey.com"
```

## Changes and the working copy

In Jujutsu, history is composed of a tree of **changes**. A change contains a
set of modifications to the repository, just like a Git commit. However, unlike
commits (which are immutable and thus get different identifiers whenever they
are amended), changes have a **persistent ID** that does not change when the
contents of the change are modified. This means that you can always refer to the
same change with the same change ID, even after amending or rebasing it. The
change ID is also embedded in the underlying Git commit as a header, which
allows it to survive being pushed to and pulled from a remote without getting
rerolled.

Let's make a new Jujutsu repository to play around in:

```sh
mkdir hello-jj
cd hello-jj
jj git init
```

This will create what we call a **non-colocated** repo, where you can only run
Jujutsu commands. If you want to be able to run Git commands and use Git
tooling, you should instead create a [colocated repo][5] with
`jj git init --colocate`.

[5]: https://jj-vcs.github.io/jj/latest/git-compatibility/#co-located-jujutsugit-repos

You'll notice that when you run `jj log`, the repository already has _multiple_
revisions:

```ansi
[1m[38;5;2m@[0m  [1m[38;5;13mq[38;5;0mtlskvql[39m [38;5;3mIsaac Corbrey[39m [38;5;14m7 minutes ago[39m [38;5;12m5[38;5;0m2fe4ac4[39m[0m
│  [1m[38;5;10m(empty)[39m [38;5;10m(no description set)[39m[0m
[1m[38;5;14m◆[0m  [1m[38;5;5mz[0m[38;5;0mzzzzzzz[39m [38;5;2mroot()[39m [1m[38;5;4m0[0m[38;5;0m0000000[39m
```

The first (`root()`) is the [root commit][6], and it's an empty revision with no
description. You cannot change it, and all other revisions must descend from it.
In Git land, this revision doesn't actually exist; it's an abstraction provided
by Jujutsu to avoid the weirdness introduced by having multiple completely
parallel commit trees.

[6]: https://jj-vcs.github.io/jj/latest/glossary/#root-commit

The second commit is empty and has no description. This may be confusing at
first, especially if you're coming from Git, but this commit is your [working
copy][7] (denoted by the `@` symbol). Whenever you run a `jj` command, any
changes made to your repository will get **automatically snapshotted** and added
to the working copy commit. This would be a nightmare in Git since you'd
immediately lose the ID of the commit you were just working on, but thanks to
those persistent change IDs we don't lose that information.

[7]: https://jj-vcs.github.io/jj/latest/working-copy/#introduction

If you don't want running a `jj` command to snapshot your changes for one reason
or another, you can add `--ignore-working-copy` to whatever you're running. This
is useful if you need to get information about your repo without modifying it,
especially for anything performance sensitive like terminal prompts.

You'll notice that only part of the change ID (on the left hand side) is colored
in. This is Jujutsu identifying the smallest portion of the change ID you need
to be able to uniquely reference it. Right now it's just one character, but as
you get more changes in your working tree this will expand as far as it needs
to. Thankfully this is scoped to what's "visible" from the current working copy,
so you don't need to worry about a repository of 10,000 commits making it
impossible to easily work with what's recent.

Make some changes to a file (I just ran `echo "Hello, jj!" > README.md`) and run
`jj log` again:

```ansi
[1m[38;5;2m@[0m  [1m[38;5;13mq[38;5;0mtlskvql[39m [38;5;3mIsaac Corbrey[39m [38;5;14m8 seconds ago[39m [38;5;12m4[38;5;0me3a9fc7[39m[0m
│  [1m[38;5;3m(no description set)[39m[0m
[1m[38;5;14m◆[0m  [1m[38;5;5mz[0m[38;5;0mzzzzzzz[39m [38;5;2mroot()[39m [1m[38;5;4m0[0m[38;5;0m0000000[39m
```

You'll see that our commit is no longer empty, and still has the same change ID.
The keen eyed among you will notice that the commit ID (over on the right hand
side) _has_ changed. This is expected, and reflects how Jujutsu is storing its
data within Git. Now we can add a message to our change with `jj describe`,
which will open up your `$EDITOR` so you can add one. You can also provide one
inline with `jj describe -m "<your message>"`.

```ansi
[1m[38;5;2m@[0m  [1m[38;5;13mq[38;5;0mtlskvql[39m [38;5;3mIsaac Corbrey[39m [38;5;14m19 seconds ago[39m [38;5;12m9[38;5;0m182d3e3[39m[0m
│  [1mreadme: Say hello to Jujutsu[0m
[1m[38;5;14m◆[0m  [1m[38;5;5mz[0m[38;5;0mzzzzzzz[39m [38;5;2mroot()[39m [1m[38;5;4m0[0m[38;5;0m0000000[39m
```

Now use `jj new` to create a new commit on top of the current working copy:

```ansi
[1m[38;5;2m@[0m  [1m[38;5;13ml[38;5;0mvszznws[39m [38;5;3mIsaac Corbrey[39m [38;5;14m1 second ago[39m [38;5;12m7[38;5;0mb581fcc[39m[0m
│  [1m[38;5;10m(empty)[39m [38;5;10m(no description set)[39m[0m
○  [1m[38;5;5mq[0m[38;5;0mtlskvql[39m [38;5;3mIsaac Corbrey[39m [38;5;6m1 minute ago[39m [1m[38;5;4m9[0m[38;5;0m182d3e3[39m
│  readme: Say hello to Jujutsu
[1m[38;5;14m◆[0m  [1m[38;5;5mz[0m[38;5;0mzzzzzzz[39m [38;5;2mroot()[39m [1m[38;5;4m0[0m[38;5;0m0000000[39m
```

Congrats! You've made your first change using Jujutsu. Note that you can combine
these two steps using `jj commit [-m "<your message>"]` to describe your change
and make a new one in one go.

## Bookmarks and remotes

Now we've got some changes in source control. That's cool and all, but obviously
we're going to want to get this up into our forge so our team can use our
changes. However, there's a problem if you haven't noticed it already: There are
no branch names!

Git really, _really_ wants you to always be on a branch. When you commit, Git
will advance the branch ref to point at your new commit. To the user, this feels
like you're in this special "lane" of history (think about how dirty it feels to
commit straight to dev or master in Git). We don't do that in Jujutsu; except
for the rare occasion, you're typically operating in a detached head state from
Git's perspective.

Git branches get mapped to [bookmarks][8] in Jujutsu. Bookmarks can be thought
of as simply pointers to commits, and conceptually they're a lot more ephemeral
than in Git. Bookmarks can arbitrarily be moved to point at any commit you want,
and multiple bookmarks pointing to the same commit is a non-issue. 

[8]: https://jj-vcs.github.io/jj/latest/bookmarks/

TK

## Revsets (a query language for history!)

As you and your team contribute changes to your project, your repository will
naturally get longer and more complex. Jujutsu provides a functional language
for selecting sets of revisions (aptly named [revsets][9]), and it's wildly
useful for interacting with your history.

[9]: https://jj-vcs.github.io/jj/latest/revsets/

TK

## Rewriting history

TK

## Conflicts as first class objects

TK

## Aliases

TK

## Megamerges and absorbing

TK

Here's a snapshot of what my working tree looks like while working on a project
(for instance this blog post!):

```ansi
[1m[38;5;2m@[0m  [1m[38;5;13mqv[38;5;0mknlxll[39m [38;5;3mIsaac Corbrey[39m [38;5;14m1 minute ago[39m [38;5;12m2[38;5;0m211ea6e[39m[0m
│  [1m[38;5;10m(empty)[39m [38;5;10m(no description set)[39m[0m
○        [1m[38;5;5mqz[0m[38;5;0mkuwsym[39m [38;5;3mIsaac Corbrey[39m [38;5;6m1 minute ago[39m [1m[38;5;4m78[0m[38;5;0m7ac147[39m
├─┬─┬─╮  [38;5;2m(empty)[39m merge
│ │ │ ○  [1m[38;5;5mqq[0m[38;5;0mpopvwv[39m [38;5;3mIsaac Corbrey[39m [38;5;6m3 months ago[39m [38;5;5mdraft/the-hitchhikers-guide-to-nix-flakes[39m [1m[38;5;4m0[0m[38;5;0m5d2123b[39m
│ │ │ │  feat(content): The Hitchhiker's Guide to Nix Flakes
│ │ ○ │  [1m[38;5;5my[0m[38;5;0mrsompuu[39m [38;5;3mIsaac Corbrey[39m [38;5;6m19 minutes ago[39m [38;5;5micorbrey/push-yrsompuuokux[39m [1m[38;5;4m1d[0m[38;5;0m006564[39m
│ │ ├─╯  prose: Ensure symbols remain aligned in code blocks
│ ○ │  [1m[38;5;5mpn[0m[38;5;0mvvtyvy[39m [38;5;3mIsaac Corbrey[39m [38;5;6m1 minute ago[39m [38;5;5micorbrey/push-pnvvtyvytmvo[39m [1m[38;5;4m7f[0m[38;5;0m379326[39m
│ ├─╯  [wip] content: Learn you a good Jujutsu
○ │  [1m[38;5;5mm[0m[38;5;0mtkoopox[39m [38;5;3mIsaac Corbrey[39m [38;5;6m1 month ago[39m [38;5;5mpush-mtkoopoxouws[39m [1m[38;5;4mb[0m[38;5;0m069346a[39m
├─╯  chore: Ignore .gitignore'd files in Helix
[1m[38;5;14m◆[0m  [1m[38;5;5mpl[0m[38;5;0mryzkuw[39m [38;5;3mIsaac Corbrey[39m [38;5;6m4 months ago[39m [38;5;5mmaster[39m [1m[38;5;4m10[0m[38;5;0m567a47[39m
│  chore: Shut up, Dependabot
~
```

TK
