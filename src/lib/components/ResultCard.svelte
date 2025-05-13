<script>
	export let result;
</script>

<div
	class="min-h-48 rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-sm transition-shadow hover:shadow-md"
>
	<h3 class="font-bold text-zinc-300">{result.title}</h3>
	<p class="text-sm text-zinc-500">{result.date}</p>
	<p class="mt-2 text-sm text-zinc-400">{result.description}</p>
</div>
