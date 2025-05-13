import { json } from '@sveltejs/kit';
import { OpenAI } from 'openai';
import { supabase } from '$lib/supabaseClient';
import { openai } from '$lib/openai';

//console.log('🚀 API Search endpoint loaded');

// API endpoint to handle semantic search
export const POST = async ({ request }) => {
	//console.log('⚡ Received search request');

	try {
		// Get the query from the request body
		const body = await request.json();
		const { query } = body;

		//console.log('🔍 Processing query:', query);

		if (!query || !query.trim()) {
			return json({ error: 'Query is required' }, { status: 400 });
		}

		//console.log('🧠 Generating embedding from OpenAI...');
		// Generate embedding from query
		const result = await openai.embeddings.create({
			input: query,
			model: 'text-embedding-3-small'
		});

		const [{ embedding }] = result.data;
		//console.log(`📏 Embedding dimension: ${embedding.length}`);

		//console.log('🔎 Searching Supabase for similar moments...');
		// Use the embedding to search for matching moments according to postgres function we defined offline
		const { data: moments, error } = await supabase
			.rpc('match_moment', {
				query_embedding: embedding,
				match_threshold: 0.4 // Keep threshold around here to work nicely
			})
			.select('id, title, date, description, link, category')
			.limit(10);

		if (error) {
			console.error('Supabase query error:', error);
			return json({ error: 'Failed to search moments' }, { status: 500 });
		}

		//console.log(`✅ Found ${moments.length} moments`);

		return json({ moments });
	} catch (error) {
		console.error('Search API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
