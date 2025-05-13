<script>
	import { fly, fade, crossfade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Loader2 } from 'lucide-svelte';
	import ResultCard from '$lib/components/ResultCard.svelte';
	import ResultCardSkeleton from '$lib/components/skeletons/ResultCardSkeleton.svelte';

	let searchTerm = '';
	let isLoading = false;
	let searchResults = [];
	let hasSearchedBefore = false;
	let searchPlaceholder =
		'Were there any huge musical events in Dublin happening around 10 years ago?';

	const handleSubmit = async () => {
		if (!searchTerm.trim()) return;

		isLoading = true;
		// Note: We're not clearing searchResults here so we know how many skeleton cards to show

		try {
			// Simulate API call with timeout
			await new Promise((resolve) => setTimeout(resolve, 1240));

			// Mock results - replace with actual API call
			const newResults = Array(10)
				.fill()
				.map((_, i) => ({
					id: i + 1,
					title: `Event ${i + 1} related to "${searchTerm}"`,
					date: new Date(2020 + i, i % 12, (i % 28) + 1).toLocaleDateString(),
					description: `This is a sample event description for "${searchTerm}". More details would appear here.`
				}));

			searchResults = newResults;
			hasSearchedBefore = true;
		} catch (error) {
			console.error('Error fetching results:', error);
		} finally {
			isLoading = false;
		}
	};

	const handleKeydownInTextArea = (event) => {
		// Check for Ctrl+Enter (or Cmd+Enter on Mac)
		if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
			event.preventDefault(); // Prevent default behavior
			handleSubmit();
		}
	};
</script>

<div class="min-h-screen bg-zinc-950 p-4">
	<div class="flex flex-col items-center gap-4 pt-8">
		<div class="mx-auto h-32 w-32 overflow-hidden rounded-md">
			<enhanced:img
				src="$lib/assets/tractor.png"
				alt="Throwback search tractor logo"
				fetchpriority="high"
			/>
		</div>
		<div class="mx-auto w-full max-w-3xl">
			<form on:submit|preventDefault={handleSubmit} class="mb-8">
				<div class="flex flex-col gap-4 rounded-md bg-zinc-900 p-4">
					<Textarea
						class="text-md ring-offset-none min-h-32 w-full resize-none rounded-md border-none bg-zinc-800 py-4 text-zinc-50 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
						bind:value={searchTerm}
						placeholder={searchPlaceholder}
						autocomplete="off"
                        on:keydown={handleKeydownInTextArea}
					/>

					<Button
						type="submit"
						class="mx-auto max-w-32 rounded-md bg-slate-200 py-6 text-slate-900 transition duration-150 ease-out hover:scale-105 hover:opacity-90"
						disabled={isLoading}
					>
						{#if isLoading}
							Searching...
						{:else}
							Search
						{/if}
					</Button>
				</div>
			</form>
		</div>
	</div>

	<div class="mx-auto w-full max-w-3xl">
		{#if isLoading && !hasSearchedBefore}
			<div class="flex justify-center py-12">
				<div class="flex flex-col items-center gap-4">
					<Loader2 class="h-6 w-6 animate-spin text-zinc-300" />
				</div>
			</div>
		{:else if isLoading && hasSearchedBefore}
			<h2 class="mb-4 text-xl font-semibold text-zinc-300">Top Results</h2>
			<div class="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 lg:grid-cols-3">
				{#each Array(searchResults.length) as _, i (i)}
					<ResultCardSkeleton />
				{/each}
			</div>
		{:else if searchResults.length > 0}
			<h2 class="mb-4 text-xl font-semibold text-zinc-300">Top Results</h2>
			<div class="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 lg:grid-cols-3">
				{#each searchResults as searchResult (searchResult.id)}
					<ResultCard result={searchResult} />
				{/each}
			</div>
		{/if}
	</div>
</div>
