<script>
	export let result;
</script>

<div
	class="min-h-48 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 p-4 break-all shadow-sm transition-all duration-150 ease-out hover:bg-zinc-800 hover:shadow-md"
>
	<h3 class="overflow font-bold text-wrap text-zinc-300">{result.title}</h3>
	<p class="text-sm text-zinc-500">{result.date}</p>
	<p class="mt-2 text-sm text-zinc-400">{result.description}</p>
</div>
