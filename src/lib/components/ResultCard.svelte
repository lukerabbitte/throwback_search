<script>
	import { Badge } from '$lib/components/ui/badge';
	export let result;

	// Format similarity as percentage if it exists
	const formatSimilarity = () => {
		if (result.similarity !== undefined) {
			return Math.round((1 - result.similarity) * 100) + '%';
		}
		return null;
	};

	// Check if URL is valid
	const isValidUrl = (url) => {
		if (!url) return false;
		try {
			new URL(url);
			return true;
		} catch (e) {
			return false;
		}
	};

	// Get badge variant based on category
	const getCategoryVariant = (category) => {
		if (!category) return 'outline';

		const categoryColors = {
			Film: 'bg-yellow-400 hover:bg-yellow-500',
			Business: 'bg-blue-400 hover:bg-blue-500',
			'Arts & Culture': 'bg-purple-400 hover:bg-purple-500',
			Television: 'bg-indigo-400 hover:bg-indigo-500',
			Sport: 'bg-emerald-400 hover:bg-emerald-500',
			Music: 'bg-pink-400 hover:bg-pink-500',
			Literature: 'bg-amber-400 hover:bg-amber-500',
			Politics: 'bg-red-400 hover:bg-red-500'
		};

		return categoryColors[category] || 'bg-zinc-600 hover:bg-zinc-700';
	};
</script>

<div
	class="flex min-h-48 flex-col justify-between gap-4 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-sm transition-shadow hover:shadow-md"
>
	<div class="flex flex-col items-start justify-between gap-1">
		<h3 class="font-bold text-wrap break-words text-zinc-100">{result.title}</h3>
		{#if formatSimilarity()}
			<span class="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-400">
				{formatSimilarity()}
			</span>
		{/if}
		<p class="text-sm break-words text-zinc-400">{result.date}</p>
	</div>

	<p class="line-clamp-8 text-sm break-words text-zinc-200">
		{result.description}
	</p>

	<div class="flex w-full flex-row flex-wrap gap-2">
		{#if result.category}
			<Badge class={`h-6 border-none text-sm ${getCategoryVariant(result.category)}`}>
				{result.category}
			</Badge>
		{/if}

		{#if isValidUrl(result.link)}
			<a href={result.link} target="_blank" rel="noopener noreferrer">
				<Badge
					variant="outline"
					class="h-6 cursor-pointer border-none bg-zinc-300 text-sm hover:bg-zinc-300"
					>Learn More</Badge
				>
			</a>
		{/if}
	</div>
</div>

<!-- Comment here -->