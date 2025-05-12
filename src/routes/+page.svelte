<script>
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Loader2 } from 'lucide-svelte';

	let searchTerm = '';
	let isLoading = false;
	let searchResults = [];
	let placeholderIndex = 0;
	let placeholderInterval;
	let searchPlaceholder = '';

	const placeholders = [
		'What kind of event are you thinking of?',
		'Searching for a concert from 2015?',
		'Remember that festival you loved?',
		'Looking for that sporting event?'
	];

	onMount(() => {
		updatePlaceholder();
		placeholderInterval = setInterval(updatePlaceholder, 3000);
		return () => clearInterval(placeholderInterval);
	});

	const updatePlaceholder = () => {
		placeholderIndex = (placeholderIndex + 1) % placeholders.length;
		searchPlaceholder = placeholders[placeholderIndex];
	};

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

<div class="flex h-screen flex-col items-center justify-center bg-slate-50 p-4">
	<div class="mx-auto w-full max-w-3xl">
		<form on:submit|preventDefault={handleSubmit} class="mb-8">
			<div class="flex gap-4 bg-slate-300 p-4 rounded-md">
				<Input
					type="text"
					class="w-full rounded-md border-none bg-slate-50 py-6 text-lg text-slate-900"
					bind:value={searchTerm}
					placeholder={searchPlaceholder}
					autocomplete="off"
				/>
				<Button
					type="submit"
					class="rounded-md bg-slate-200 py-6 text-slate-900 transition duration-150 ease-out hover:scale-105 hover:opacity-90"
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
					<Loader2 class="text-primary h-12 w-12 animate-spin" />
					<p class="text-lg">Finding your events...</p>
				</div>
			</div>
		{:else if searchResults.length > 0}
			<div transition:fade={{ duration: 300 }}>
				<h2 class="mb-4 text-xl font-semibold">Top Results</h2>
				<div class="grid grid-cols-1 gap-4 overflow-x-auto pb-4 md:grid-cols-2 lg:grid-cols-3">
					{#each searchResults as result (result.id)}
						<div
							class="rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
							transition:fly={{ y: 20, duration: 300, delay: result.id * 50 }}
						>
							<h3 class="font-bold">{result.title}</h3>
							<p class="text-muted-foreground text-sm">{result.date}</p>
							<p class="mt-2 text-sm">{result.description}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
