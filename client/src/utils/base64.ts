import sharp from 'sharp';
import { Buffer } from 'buffer';

export const optimizeImageToBase64 = async (buffer: Buffer): Promise<string> => {
    try {
        const optimizedBuffer = await sharp(buffer)
            .resize(1200) // Resize to 1200px width
            .jpeg({ quality: 80 }) // Compress the image
            .toBuffer(); // Convert to buffer

        return `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`; // Convert to Base64
    } catch (error) {
        console.error("Error optimizing image:", error);
        throw new Error("Image optimization failed");
    }
};

// Example usage

// import fs from 'fs/promises';

// async function main() {
//     const imagePath = 'path-to-your-image.jpg';
//     const imageBuffer = await fs.readFile(imagePath); // Read the image file as a Buffer

//     const base64Image = await optimizeImageToBase64(imageBuffer);
//     console.log("Optimized Base64 Image:", base64Image);
// }