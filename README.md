# Throwback Tractor

()[https://throwbacktractor.netlify.app]

This is a simple prototype of a social media assistant tool built using SvelteKit, ShadCN Svelte, Tailwind, Supabase, PostgreSQL Vector Search, and OpenAI embeddings API.

It is designed to reference a PostgreSQL table of the schema (title, date, description, link, category) representing user-supplied cultural and historical moments with the intention to make it easy to surface highly relevant cultural and historical events for a creator wishing to ground their posts by referencing related touchstones from the past.

A script (populate.js) is provided to calculate embeddings of dimension (1536) across a table, offline.

When a user submits a natural language description, we generate an embedding of their query and match this to an index of the description embeddings in the database to find highly relevant cultural moments to consider.

A future improvement could be building out a calendar interface showing relevant upcoming anniversaries for posts of the "on this day in..." variety.

Needless to say, accurate and plentiful data that can be easily adapted to this schema is a prerequisite for a good experience with this project! Also make sure to bring Supabase and OpenAI keys as well as a Supabase PostgreSQL table of the correct schema (I called my table "moment").

Interesting further reading, discussing a cool use case of AI in helping to surface good fodder for social media from a comprehensive yet unstructured archive, is the following:

()[https://www.nature.com/articles/s41598-024-80378-2]
