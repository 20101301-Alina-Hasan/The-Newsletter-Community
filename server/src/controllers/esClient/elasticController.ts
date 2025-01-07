import { Request, Response } from "express";
import { client } from "../../config/elasticSearch";

export const getArticlesFromElastic = async (req: Request, res: Response) => {
    try {
        const result = await client.search({
            index: "articles",
            body: {
                query: {
                    match_all: {},
                },
            },
            size: 9999,
        });

        const articles = result.hits.hits.map((hit: any) => ({
            id: hit._id,
            ...hit._source,
        }));

        res.status(200).json(articles);
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch articles from Elasticsearch" });
    }
};


