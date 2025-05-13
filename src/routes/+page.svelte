<script>
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Loader2 } from 'lucide-svelte';
	import ResultCard from '$lib/components/ResultCard.svelte';
	import ResultCardSkeleton from '$lib/components/skeletons/ResultCardSkeleton.svelte';
	import { toast } from 'svelte-sonner';

	let searchTerm = '';
	let isLoading = false;
	let searchResults = [];
	let hasSearchedBefore = false;
	let searchPlaceholder = `E.g. "Huge Irish sporting achievement of the 90's"`;

	const handleSubmit = async () => {
		if (!searchTerm.trim()) return;

		//console.log('🔍 Search initiated with query:', searchTerm);
		isLoading = true;

		// Note: We don't clear searchResults just yet so we know how many skeleton cards to show

		try {
			//console.log('📤 Sending request to /api/search endpoint...');
			// Call our semantic search API
			const response = await fetch('/api/search', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ query: searchTerm })
			});

			//console.log('📥 Received response with status:', response.status);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to search');
			}

			const data = await response.json();
			//console.log('✅ API returned data:', data);
			//console.log(`📊 Found ${data.moments?.length || 0} results`);

			// Transform moments to match the expected format
			const newResults = data.moments.map((moment) => ({
				id: moment.id,
				title: moment.title,
				date: new Date(moment.date).toLocaleDateString(),
				description: moment.description,
				link: moment.link,
				category: moment.category
			}));

			searchResults = newResults;
			hasSearchedBefore = true;
		} catch (error) {
			console.error('Error fetching results:', error);
			toast.error('Search failed', {
				description: error.message || 'Something went wrong'
			});
			// If search fails, keep the previous results if any
			if (!searchResults.length) {
				searchResults = [];
			}
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
			<div class="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 lg:grid-cols-3">
				{#each Array(searchResults.length) as _, i (i)}
					<ResultCardSkeleton />
				{/each}
			</div>
		{:else if searchResults.length > 0}
			<div class="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 lg:grid-cols-3">
				{#each searchResults as searchResult (searchResult.id)}
					<ResultCard result={searchResult} />
				{/each}
			</div>
		{:else if hasSearchedBefore && searchResults.length === 0}
			<div
				class="flex flex-col items-center justify-center py-16 text-center"
				transition:fade={{ duration: 200 }}
			>
				<div class="mb-4 rounded-full bg-zinc-800 p-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-zinc-400"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /></svg
					>
				</div>
				<h3 class="mb-2 text-xl font-medium text-zinc-300">No results found</h3>
				<p class="max-w-md text-zinc-400">
					We couldn't find any events matching your search. Try using different keywords or a more
					general search term.
				</p>
			</div>
		{/if}
	</div>
</div>
