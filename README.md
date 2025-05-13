# Throwback Tractor

This is a simple prototype of a social media assistant tool built using SvelteKit, ShadCN Svelte, Tailwind, Supabase, Postgres Vector Search, and OpenAI embeddings API.

It is designed to reference a PostgreSQL table of the schema (title, date, description, link, category) representing user-supplied cultural and historical moments with the intention to make it easy to surface highly relevant cultural and historical events for a creator wishing to ground their posts by referencing related touchstones from the past.

A script (populate.js) is provided to calculate embeddings of dimension (1536) across a table, offline.

When a user submits a natural language description, we generate an embedding of their query and match this to an index of the description embeddings in the database to find highly relevant and factual cultural moments to consider.

A future improvement could be building out a calendar interface showing relevant upcoming anniversaries for posts of the "on this day in..." variety.

Needless to say, accurate and plentiful data that can be easily adapted to this data schema is a prerequisite for a good experience with this project!
