---
title: "The Hitchhiker's Guide to Nix Flakes"
description: |
  From zero to one in Nix, a declarative system for defining environments.
tags: [just, nix]
videoUrl: https://www.youtube.com/embed/dQw4w9WgXcQ?si=ar0pEZ0ftpLj4zyD
---

Nix is... a bit of an enigma when you first run into it. It is no less than 4
(!) different things: a language; a package management system; a build system;
and an operating system. For the purposes of this post, we're just going to be
focusing on the first two, and how you can make Nix for you.

To start out, make sure you have Nix installed on your system. If you're on
Linux or WSL, I recommend installing Nix via the
[Determinate installer][install-nix]. If you're on NixOS or `nix-darwin` on
MacOS, you'll want to enable flakes and commands in your configuration file.

## The Nix language

Nix is a functional programming language. For those unfamiliar, this means that
rather than writing step-by-step instructions that modify variables like you
would in a language like Python, you instead write your code declaratively
using pure functions and immutable data.

If you've ever worked with JSON, you can think of Nix as just a slightly
different version of JSON that happens to have functions in it. Without
functions, Nix's primitive types, lists, and attribute sets:

```nix
{
  string = "hello";
  integer = 1;
  float = 3.1415;
  boolean = true;
  null-value = null;
  list = [ 1 "two" false ];
  attribute-set = {
    a = "hello";
    b = 2;
    c = 6.2836;
    d = false;
  };
}
```

...map perfectly to JSON's primitive types, arrays, and objects:

```json
{
  "string": "hello",
  "integer": 1,
  "float": 3.1415,
  "boolean": true,
  "null-value": null,
  "list": [ 1, "two", false ],
  "attribute-set": {
    "a": "hello",
    "b": 2,
    "c": 6.2836,
    "d": false,
  }
}
```

Now Nix's functions themselves are a bit odd at first, but ultimately they're
pretty simple. Basically, Nix functions have exactly one parameter and **must**
return a value:

```nix
# increment.nix
{
  increment = x: x + 1;
}
```

If you want to pass in multiple parameters, you have to work around this. You
can either accept an attribute set as a parameter:

```nix
# subtract.nix
{ lhs, rhs }: lhs - rhs
```

Or you can "take multiple parameters" by simply returning one function from
another. If you've never seen this before, this is called "currying", and is a
staple of many functional programming languages:

```nix
{
  divide = lhs: rhs: lhs / rhs;
}
```

Finally, let's talk files. In Nix, files must contain one value. This can be a
primitive type, a list, an attribute set, or a function. You can get this value
by importing it wherever needed:

```nix
{
  # difference = -1!
  difference = import ./subtract.nix {
    lhs = 1;
    rhs = 2;
  };
}
```

Every single code block with Nix code in this post is a completely valid Nix
file. Ain't that cool?

## What are flakes?

Now that we have a basic understanding of how the Nix language works, let's
take a second to understand what flakes are.

Flakes are just a folder which has a `flake.nix` file at its root. This file
contains an attribute set with two attributes: `inputs` and `output`.

```nix
{
  inputs = {
    # ...
  };

  output = { ... } @ inputs: {
    # ...
  };
}
```

- `inputs` is another attribute set containing definitions for every flake this
  one relies on. At minimum you must define the URL for these flakes, but there
  are other values you may want to configure (for example, forcing one flake to
  use the same version of `nixpkgs` as another).
- `output` is a function which accepts as parameters the return values of the
  `output` function of every flake contained in `inputs`. It then returns its
  own value based on those inputs.

As an example, let's say your flake depended on `nixpkgs` and `home-manager`.
You can think of Nix evaluating your flake as doing something like this:

```nix
your-flake.output {
  nixpkgs = nixpkgs.output {
    # ...
  };

  home-manager = home-manager.output {
    # ...
  };
};
```

## Initializing your flake

In the terminal, go ahead and create a new directory for your flake to live in.
Within this directory we'll create the flake file and initialize a new Git
repository:

```sh
mkdir your-flake
cd your-flake
touch flake.nix
git init
```

Working on your flake within a Git repository is mandatory. Since Nix flakes
are intended to be completely deterministic (meaning that the output will
always be the same if you give it the same input), Nix requires that the flake
file itself as well as any local files the flake references be at minimum
staged in Git. In fact, Nix will actually warn you if your repository has
uncommitted changes when you run it. If any file is not at least staged in Git,
Nix will completely ignore its existence without saying why.

Open `flake.nix` in your favorite editor and make it look more or less like
this:

```nix
{
  inputs = {
    # Nix packages <https://github.com/NixOS/nixpkgs>
    nixpkgs.url = "github:NixOS/nixpkgs";
  };

  output = { nixpkgs, ... } @ inputs: let
    # Make sure this is correct for your system!
    system = "x86_64-linux";

    # Coalate all package sources here
    pkgs = import nixpkgs {
      inherit system;
    };
  in {
    # TODO
  };
}
```

Here we're importing `nixpkgs` (which contains all stable packages from Nix's
official repo), then filtering it down to just packages for our specific
system.

## Bootstrapping with Nix dev shells

With your flake's bones set up, we can turn our attention to getting this thing
off the ground. We'll be using a program called [Home Manager][home-manager] to
manage our user's home (funny how that works), as well as [`just`][just] to
make it easier to iterate on our config.

We could just run something like this to temporarily install these
dependencies:

```sh
nix shell nixpkgs#home-manager nixpkgs#just
```

But that's a lot of awkward typing, especially when Nix has a built-in way of
doing exactly what we're trying to do. Nix's **dev shells** are an easy way to
define declarative temporary shells for development within a project. We'll be
using them to temporarily load Git, Home Manager, and just before actually
loading our flake.

Start by creating `shell.nix` next to `flake.nix` and loading the packages we
need:

```nix
{ pkgs }:
{
  default = pkgs.mkShell {
    nativeBuildInputs = [
      pkgs.git
      pkgs.home-manager
      pkgs.just
    ];
  };
}
```

You'll notice this is a function that takes a parameter `pkgs`. We'll provide
this when we add this file as a dev shell in `flake.nix`:

```nix
{
  inputs = {
    # ...
  };

  output = { nixpkgs, ... } @ inputs: let
    system = "x86_64-linux";

    pkgs = import nixpkgs {
      inherit system;
    };
  in {
    devShells.${system} = import ./shell.nix {
      inherit pkgs;
    };
  }
}
```

Perfect! Now we can run `nix develop` in our flake directory and have immediate
access to Git, Home Manager, and just with no further configuration.

## Automating iteration with just

Just is great for automating common tasks in your project. Think of it as
having access to NPM scripts for any kind of project, not just JavaScript ones.

What I've done is provided a kind of opinionated workflow for managing your Nix
configuration. Feel free to copy the following code and pasting it into
`justfile` next to `flake.nix`:

```just
default:
  @just --list

# Install the configuration for the given hostname
install hostname=shell('hostname'): _stage (_switch hostname)

# Install the configuration for the given hostname and push to the origin
commit hostname=shell('hostname'): _stage (_switch hostname) _commit

# Reset to the last committed configuration for the given hostname
reset hostname=shell('hostname'): _reset (_switch hostname)

_commit:
	@git commit -m "Generation #`git log -1 --pretty=%B | tr -d -c 0-9 | awk '{print $1 + 1}'`"
	@git push origin master

_reset:
	@git fetch origin
	@git reset --hard origin/master

_stage:
	@git add .

_switch hostname:
	@home-manager switch --flake .#{{hostname}}
```

Let's go over what these commands actually do:

- Running `just install` will stage all changes in your repository, then tell
  Home Manager to load the flake as its configuration. You can use this when
  first installing your configuration or when making changes to see if they
  work before committing.
- Running `just commit` will perform the same actions as `just install`, but if
  everything loads successfully will automatically commit all changes with an
  auto-incrementing message and push them to the Git origin. I generally do
  this if I'm done making changes or have reached a good save point and want to
  push them to my GitHub repository.
- Running `just reset` will bring your local repository up to date with what's
  on your Git origin. This is a **DESTRUCTIVE** operation, and if you happen to
  have commits on your local machine that aren't on the origin this will
  **ERASE** them. I use this as a nuclear reset option when I've irrevocably
  messed something up, or just if I've made changes to my configuration on one
  machine and need to pull them down onto another.

All of these commands accept a hostname as an optional argument, and if nothing
is passed in will use the system's current hostname as the argument. My flakes
are built around single user computers, so this works well for me. I also have
some basic templating commands set up for configuring new packages, which I've
excluded.

## Setting up Home Manager

After all that, now we can set up our Home Manager configuration. First, add
Home Manager as an input in your flake:

```nix
{
  inputs = {
    # Home Manager <https://github.com/nix-community/home-manager>
    home-manager.url = "github:nix-community/home-manager";
    home-manager.inputs.nixpkgs.follows = "nixpkgs";

    # ...
  };

  # ...
}
```

Then set up a new Home Manager configuration referencing `home.nix` (we'll make
that here in a second):

```nix
{
  # ...

  output = { nixpkgs, home-manager, ... } @ inputs: let
    # ...
  in {
    # ...

    homeConfigurations = {
      my-hostname = home-manager.lib.homeManagerConfiguration {
        inherit pkgs;
        modules = [./home.nix];
      };
    };
  };
}
```

Now create `home.nix` and set up the basics: your username and home directory,
the current state version of Home Manager, and the same packages we asked for
in `shell.nix`:

```nix
{ pkgs, ... }:
{
  home.homeDirectory = "/home/john-nix";
  home.username = "john-nix";

  # Don't touch this unless you know what you're doing!
  home.stateVersion = "24.11";

  home.packages = with pkgs; [
    git
    home-manager
    just
  ];
}
```

There we go! Notice how we used `with pkgs;` this time. This lets us reference
the packages we want from within `pkgs` directly instead of having to preface
each one with `pkgs.whatever`.

Now we can run `just install` and see our environment come to life. Make sure
to manually commit your changes::

```sh
git commit -m "Generation #1"
```

You won't have to do this again, since `just commit` will extract the number on
subsequent runs and automatically increment it for you.

## What good does this do me?

Now that we have everyting set up, it's really easy to add new things to your
system. Let's explore how this works by installing and configuring
[Starship][starship], a cross-shell prompt that I quite like. We can do this
by modifying `home.nix`:

```nix
{ pkgs, ... }:
{
  # ...

  programs.starship = {
    enable = true;
    settings = {
      cmd_duration.disabled = true;
      directory.style = "bold blue";
      username.show_always = true;
    };
  };
}
```

You'll notice that we aren't including `starship` in `home.packages`. A lot of
packages by convention let you install them by setting
`programs.<package>.enable = true;`. Settings generally live under
`programs.<package>.settings`, though this can vary by package.

Normally, Starship is configured with a TOML file stored... _somewhere_. I
don't actually know where it gets stored, but I don't need to. Nix will build
that TOML file and place it where it needs to go automatically, so you don't
really need to think about that.

This is far from the only benefit; once we validate and commit this with
`just commit`, not only will we have a prompt that works exactly the way we
wanted it to, but now we can recreate this on _any machine with Nix installed
on it_. Imagine being able to load your exact preferred desktop configuration
on any machine in a couple keystrokes. Sounds pretty nice to me.

## Closing thoughts

You can do a lot with Nix, and we've only scratched the surface. I'll be
sharing what I find as I get deeper into the weeds, and hopefully you guys find
it helpful (or at least entertaining). Here are a couple things to help you get
started:

- The [NixOS package search page][search] is a great place to start looking for
  packages you might need.
- The [NixOS wiki][wiki] has a lot of great resources for learning as well as
  documenting a lot of configuration details for packages.

If you found this helpful or just appreciate what I do, please consider
[making a donation][ko-fi]! I greatly appreciate any and all support, and I
want to be able be able to contribute my efforts back to the learning
environment that made me the developer I am today.

Additionally, I've launched a new [Discord server][discord] for all us nerds to
hang out in! It's publicly available for all to join, so come talk shop with
us. I want to foster a healthy, helpful community to lower the barrier to entry
of programming for all.

Thanks for stopping by!

[discord]: https://discord.gg/n9smmgTDvS
[home-manager]: https://nix-community.github.io/home-manager/
[install-nix]: https://zero-to-nix.com/start/install/
[just]: https://just.systems
[ko-fi]: https://ko-fi.com/icorbrey
[search]: https://search.nixos.org/packages
[starship]: https://starship.rs
[wiki]: https://nixos.wiki/
