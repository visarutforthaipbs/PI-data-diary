import { NextResponse } from "next/server";
import { getDatasets } from "@/utils/notion";
import { mockDatasets } from "@/data/mockData";

export async function GET() {
  try {
    // Try to get data from Notion first
    const notionDatasets = await getDatasets();

    // If Notion returns data, use it; otherwise, fall back to mock data
    const datasets = notionDatasets.length > 0 ? notionDatasets : mockDatasets;

    return NextResponse.json({
      datasets,
      source: notionDatasets.length > 0 ? "notion" : "mock",
    });
  } catch (error) {
    console.error("Error in datasets API:", error);
    // Fall back to mock data on error
    return NextResponse.json({ datasets: mockDatasets, source: "mock" });
  }
}
