---
title: "The Hitchhiker's Guide to Nix Flakes"
description: |
  From zero to one in Nix, a declarative system for defining environments.
tags: [just, nix]
---

Nix is... a bit of an enigma when you first run into it. It is no less than 4
(!) different things: a language; a package management system; a build system;
and an operating system. For the purposes of this post, we're just going to be
focusing on the first two, and how you can make Nix for you.

To start out, make sure you have Nix installed on your system. If you're on
Linux or WSL, I recommend installing Nix via the [Determinate installer][install].
If you're on NixOS or `nix-darwin` on MacOS, you'll want to enable flakes and
commands in your configuration file.

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
  difference = import ./subtraction.nix {
    lhs = 1;
    rhs = 2;
  };
}
```

Every single code block with Nix code in this post is a completely valid Nix
file. Ain't that cool?

[install]: https://zero-to-nix.com/start/install/
