// File: app/api/scrape-jobs/route.js
import { Client } from "@gradio/client";

export async function POST(request) {
  try {
    const { query, locations, timeFilter } = await request.json();
    if (!query || !locations || !timeFilter) {
      throw new Error("Missing required fields: query, locations, or timeFilter");
    }

    console.log("Request payload:", { query, locations, timeFilter });

    // Connect to Gradio Space
    const client = await Client.connect("charulp2499/JobScrapper", {
      timeout: 30000,
      // Uncomment and add token if Space is private
      // hf_token: process.env.HF_API_TOKEN,
    });

    // Make the prediction
    const result = await client.predict("/predict", {
      query,
      locations,
      time_filter: timeFilter,
    });

    console.log("Gradio response:", result);

    // Check if result.data exists and is valid
    if (!result || !result.data) {
      throw new Error("No job data returned from Gradio API");
    }

    // Temporary: Log raw data to verify structure
    console.log("Result data:", result.data);

    return new Response(JSON.stringify({ jobs: result.data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error scraping jobs:", error.message, error.stack);
    // Return the raw response if available for debugging
    const errorDetails = error.response ? error.response.data : "No additional details";
    return new Response(
      JSON.stringify({
        error: `Failed to scrape jobs: ${error.message}`,
        details: errorDetails,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export const runtime = "edge";