<script>
	export let result;

	// Format similarity as percentage if it exists
	const formatSimilarity = () => {
		if (result.similarity !== undefined) {
			return Math.round((1 - result.similarity) * 100) + '%';
		}
		return null;
	};
</script>

<div
	class="min-h-48 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-sm transition-shadow hover:shadow-md"
>
	<div class="flex items-start justify-between">
		<h3 class="font-bold text-wrap break-words text-zinc-300">{result.title}</h3>
		{#if formatSimilarity()}
			<span class="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-400">
				{formatSimilarity()}
			</span>
		{/if}
	</div>
	<p class="text-sm break-words text-zinc-500">{result.date}</p>
	<p class="mt-2 text-sm break-words text-zinc-400">{result.description}</p>
    <!-- Also can process result.link and result.category -->
</div>
