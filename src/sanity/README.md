# Sanity Integration

This folder contains the schemas and clients for connecting to a Headless Sanity CMS.

### Connecting to Real Sanity Data

When you are ready to switch from local Mock Data to your real Sanity database:
1. Create a .env.local file at the root of the project.
2. Add your project configuration:
   \\\
   SANITY_PROJECT_ID=your_project_id
   SANITY_DATASET=production
   ```
3. Next.js will automatically detect the presence of `SANITY_PROJECT_ID` inside `src/sanity/client.ts` and switch from `mockData.ts` to fetching live GROQ queries!

**Note on Video Embeds:** The `embedUrl` field supports YouTube links; use full watch URLs or short URLs (e.g. youtu.be or watch?v=). The frontend automatically normalizes this into a privacy-respecting and accessible lazy-loaded embed. The mock client will return `embedUrl` from mockData for local testing.
