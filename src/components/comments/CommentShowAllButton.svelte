<script lang="ts">
  export let count: number;
  export let level: number = 0;

  const color =
    level % 8 == 0 ? "red-400"
    : level % 8 == 1 ? "orange-400"
    : level % 8 == 2 ? "yellow-400"
    : level % 8 == 3 ? "green-400"
    : level % 8 == 4 ? "cyan-400"
    : level % 8 == 5 ? "blue-400"
    : level % 8 == 6 ? "purple-400"
    : "pink-400";
</script>

<button
  on:click
  class={`w-full mt-0.5 flex items-center pl-2 py-0.5 font-medium tracking-wide border-l-4 border-${color} bg-fg-1 bg-opacity-0 hover:bg-opacity-15`}
>
  Show {count} more comment{count !== 1 ? "s" : ""}
</button>
