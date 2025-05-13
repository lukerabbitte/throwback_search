<script>
	import { fly, fade, crossfade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Loader2 } from 'lucide-svelte';

	let searchTerm = '';
	let isLoading = false;
	let searchResults = [];
	let searchPlaceholder =
		'Were there any huge musical events in Dublin happening around 10 years ago?';

	const handleSubmit = async () => {
		if (!searchTerm.trim()) return;

		isLoading = true;
		searchResults = [];

		try {
			// Simulate API call with timeout
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Mock results - replace with actual API call
			searchResults = Array(10)
				.fill()
				.map((_, i) => ({
					id: i + 1,
					title: `Event ${i + 1} related to "${searchTerm}"`,
					date: new Date(2020 + i, i % 12, (i % 28) + 1).toLocaleDateString(),
					description: `This is a sample event description for "${searchTerm}". More details would appear here.`
				}));
		} catch (error) {
			console.error('Error fetching results:', error);
		} finally {
			isLoading = false;
		}
	};
</script>

<div
	class="flex h-screen flex-col items-center justify-center gap-4 overflow-y-scroll bg-zinc-950 p-4"
>
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
					placeholder="Were there any huge musical events in Dublin happening around 10 years ago?"
					autocomplete="off"
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

		{#if isLoading}
			<div class="flex justify-center py-12" transition:fade>
				<div class="flex flex-col items-center gap-4">
					<Loader2 class="h-12 w-12 animate-spin text-zinc-400" />
					<p class="text-lg text-zinc-300">Finding your events...</p>
				</div>
			</div>
		{:else if searchResults.length > 0}
			<div transition:fade={{ duration: 300 }}>
				<h2 class="mb-4 text-xl font-semibold text-zinc-300">Top Results</h2>
				<div class="grid grid-cols-1 gap-4 overflow-x-auto pb-4 md:grid-cols-2 lg:grid-cols-3">
					{#each searchResults as result (result.id)}
						<div
							class="rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-sm transition-shadow hover:shadow-md"
							transition:fly={{ y: 20, duration: 300, delay: result.id * 50 }}
						>
							<h3 class="font-bold text-zinc-300">{result.title}</h3>
							<p class="text-sm text-zinc-500">{result.date}</p>
							<p class="mt-2 text-sm text-zinc-400">{result.description}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
