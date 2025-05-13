import { config } from 'dotenv';
config();

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import pLimit from 'p-limit'; // For rate limiting

const openAIAPIKey = process.env['OPENAI_API_KEY'];
const supabaseUrl = process.env['SUPABASE_URL'];
const supabaseServiceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: openAIAPIKey
});

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
	auth: { persistSession: false }
});

// Set up rate limiting to avoid OpenAI API rate limits
// Allow 5 concurrent requests
const limit = pLimit(5);

// Function to generate embedding for a single moment
const generateEmbedding = async (moment) => {
	try {
		console.log(`Generating embedding for moment ID: ${moment.id}`);

		// Get embedding from OpenAI
		const result = await openai.embeddings.create({
			input: moment.description,
			model: 'text-embedding-3-small'
		});

		const [{ embedding }] = result.data;

		// Update the moment with the embedding
		const { error } = await supabase.from('moment').update({ embedding }).eq('id', moment.id);

		if (error) {
			console.error(`Error updating moment ID ${moment.id}:`, error);
			return false;
		}

		console.log(`Successfully updated embedding for moment ID: ${moment.id}`);
		return true;
	} catch (error) {
		console.error(`Error processing moment ID ${moment.id}:`, error);
		return false;
	}
};

// Main function to process all moments
const processAllMoments = async () => {
	console.log('Starting embedding generation process...');

	// Get all moments that don't have embeddings yet
	const { data: moments, error } = await supabase
		.from('moment')
		.select('id, description')
		.is('embedding', null);

	if (error) {
		console.error('Error fetching moments:', error);
		return;
	}

	console.log(`Found ${moments.length} moments to process`);

	// Calculate approximate cost
	const totalChars = moments.reduce((sum, moment) => sum + moment.description.length, 0);
	const totalTokensEstimate = totalChars / 4; // Rough estimate: 4 chars per token
	const costEstimate = (totalTokensEstimate / 1000) * 0.00002; // $0.00002 per 1K tokens for text-embedding-3-small

	console.log(`Estimated tokens: ~${Math.round(totalTokensEstimate)}`);
	console.log(`Estimated cost: ~$${costEstimate.toFixed(4)}`);
	console.log(`Estimated time: ~${Math.round(moments.length * 1.5)} seconds (with rate limiting)`);

	// Process moments concurrently with rate limiting
	const promises = moments.map((moment) => limit(() => generateEmbedding(moment)));

	// Wait for all promises to resolve
	const results = await Promise.all(promises);

	// Count successes
	const successCount = results.filter(Boolean).length;

	console.log(
		`Embedding generation complete. Successfully processed ${successCount} of ${moments.length} moments.`
	);
};

// Execute the main function and handle errors
processAllMoments()
	.catch((error) => {
		console.error('Fatal error:', error);
		process.exit(1);
	})
	.finally(() => {
		console.log('Script execution completed');
	});
