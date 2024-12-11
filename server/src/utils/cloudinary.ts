import cloudinary from '../config/cloudinary';

export const addCloudinaryImage = async (imageBase64: string): Promise<string> => {
    try {
        const result = await cloudinary.uploader.upload(imageBase64, {
            folder: "news_thumbnails",
            use_filename: true,
            unique_filename: false,
        });
        return result.secure_url; // Return the uploaded image URL
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new Error("Cloudinary upload failed");
    }
};


export const deleteCloudinaryImage = async (imageUrl: string): Promise<void> => {
    if (!imageUrl) return;

    try {
        const publicId = imageUrl.split("/").pop()?.split(".")[0]; // Extract public ID
        if (publicId) {
            await cloudinary.uploader.destroy(`news_thumbnails/${publicId}`);
            console.log(`Cloudinary image deleted: ${publicId}`);
        }
    } catch (error) {
        console.error("Error deleting Cloudinary image:", error);
    }
};
