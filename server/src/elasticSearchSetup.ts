import { client } from "./config/elasticSearch";
export const createArticleIndex = async () => {
  const index = "articles";
  const exists = await client.indices.exists({ index });
  if (!exists) {
    await client.indices.create({
      index,
      body: {
        mappings: {
          properties: {
            title: { type: "text" },
            description: { type: "text" },
            releaseDate: { type: "date" },
            thumbnail: { type: "text" },
            user_id: { type: "integer" },
            tag_ids: { type: "integer" },
          },
        },
      },
    });
    console.log(`Index "${index}" created.`);
  } else {
    console.log(`Index "${index}" already exists.`);
  }
};
