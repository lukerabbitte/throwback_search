import OpenAI from 'openai';
import { env } from '$env/dynamic/private';

export const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY
});
