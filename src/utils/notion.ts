import { Client } from "@notionhq/client";
import { Dataset } from "@/types/dataset";

// Initialize Notion client (will need environment variables)
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID || "";

export async function getDatasets(): Promise<Dataset[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    console.warn("Notion credentials not configured, using mock data");
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: "Date Updated",
          direction: "descending",
        },
      ],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.results.map((page: any) => {
      const properties = page.properties;

      return {
        id: page.id,
        title: properties["Project / Topic"]?.title?.[0]?.plain_text || "",
        project:
          properties["Used In (Outputs)"]?.rich_text?.[0]?.plain_text || "",
        description:
          properties["Description"]?.rich_text?.[0]?.plain_text || "",
        sourceName: properties["Source Name"]?.select?.name || "",
        sourceLink: properties["Source Link"]?.url || "",
        fileType: properties["File Type"]?.multi_select?.[0]?.name || "Unknown",
        dateAcquired: properties["Date Acquired"]?.date?.start || "",
        dateUpdated: properties["Date Updated"]?.date?.start || "",
        license: properties["License / Terms"]?.select?.name || "",
        tags:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          properties["Keywords"]?.multi_select?.map((tag: any) => tag.name) ||
          [],
      };
    });
  } catch (error) {
    console.error("Error fetching from Notion:", error);
    return [];
  }
}

export async function createDataset(
  dataset: Omit<Dataset, "id">
): Promise<string | null> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    console.warn("Notion credentials not configured");
    return null;
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        "Project / Topic": {
          title: [{ text: { content: dataset.title } }],
        },
        "Used In (Outputs)": {
          rich_text: [{ text: { content: dataset.project } }],
        },
        Description: {
          rich_text: [{ text: { content: dataset.description } }],
        },
        "Source Name": {
          select: { name: dataset.sourceName },
        },
        "Source Link": {
          url: dataset.sourceLink,
        },
        "File Type": {
          multi_select: [{ name: dataset.fileType }],
        },
        "Date Acquired": {
          date: { start: dataset.dateAcquired },
        },
        "Date Updated": {
          date: { start: dataset.dateUpdated },
        },
        "License / Terms": {
          select: { name: dataset.license },
        },
        Keywords: {
          multi_select: dataset.tags.map((tag) => ({ name: tag })),
        },
      },
    });

    return response.id;
  } catch (error) {
    console.error("Error creating dataset in Notion:", error);
    return null;
  }
}
