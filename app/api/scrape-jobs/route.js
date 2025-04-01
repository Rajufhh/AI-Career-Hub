// File: app/api/scrape-jobs/route.js
import { Client } from "@gradio/client";

export async function POST(request) {
  const { query, locations, timeFilter } = await request.json();

  try {
    // Connect to the Gradio API using the client
    const client = await Client.connect("charulp2499/JobScrapper");

    // Call the predict endpoint
    const result = await client.predict("/predict", {
      query: query,
      locations: locations,
      time_filter: timeFilter,
    });

    return Response.json(result);
  } catch (error) {
    console.error("Error scraping jobs:", error);
    return new Response(
      JSON.stringify({ error: "Failed to scrape jobs: " + error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
