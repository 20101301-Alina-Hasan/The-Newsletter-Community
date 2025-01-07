import { client } from "../../config/elasticSearch";

const deleteNewsFromES = async () => {
    try {
        // Loop through news_id from 1 to 151
        for (let news_id = 1; news_id <= 151; news_id++) {
            try {
                // Attempt to delete from Elasticsearch
                const response = await client.delete({
                    index: "articles",
                    id: news_id.toString(), // Assuming the id is a string in Elasticsearch
                });

                // Log the result of the deletion
                console.log(`Deleted news with ID ${news_id}:`, response);
            } catch (error: any) {
                // Handle specific error when document is not found
                if (error?.meta?.body?.error?.type === 'document_missing') {
                    console.log(`News with ID ${news_id} does not exist in Elasticsearch.`);
                } else {
                    // If the document doesn't exist or another error occurs, skip it
                    console.error(`Error deleting news with ID ${news_id} from Elasticsearch:`, error.message);
                }
                // Continue to the next iteration even if an error occurs
            }
        }
    } catch (error) {
        console.error("Error during batch deletion from Elasticsearch:", error);
    }
};

// Call the function to start the deletion process
deleteNewsFromES();