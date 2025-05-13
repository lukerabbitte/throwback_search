import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

import { config } from 'dotenv';

// Load .env file
config();

const openAIAPIKey = process.env['OPENAI_API_KEY'];
const supabaseUrl = process.env['SUPABASE_URL'];
const supabaseServiceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

const openai = new OpenAI({
	apiKey: openAIAPIKey
});

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
	auth: { persistSession: false }
});

const input = 'The cat chases the mouse';

const result = await openai.embeddings.create({
	input,
	model: 'text-embedding-3-small'
});

const [{ embedding }] = result.data;
