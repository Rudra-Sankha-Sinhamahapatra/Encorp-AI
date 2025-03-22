import { Request, Response } from "express";
import axios from "axios";

export async function imageProxy(req:Request,res:Response) : Promise<void> {
    try {
        const imageUrl = req.query.url as string;

        if(!imageUrl) {
            res.status(400).json({
                message: "Image URL is required"
            })
            return;
        }

        // Special handling for OpenAI DALL-E URLs
        const isOpenAIImage = imageUrl.startsWith('https://oaidalleapiprodscus.blob.core.windows.net');
        
        try {
            const response = await axios.get(imageUrl, {
                responseType: "arraybuffer"
            });

            res.setHeader("Content-Type", response.headers["content-type"]);
            res.set('Access-Control-Allow-Origin', '*');
            
            res.send(response.data);
        } catch (fetchError: any) {
            console.error(`Error fetching image from ${imageUrl.substring(0, 60)}...`);
            
            if (isOpenAIImage && (fetchError.response?.status === 403 || fetchError.response?.status === 401)) {
                console.log('OpenAI image URL has expired. This is expected behavior as DALL-E URLs are temporary.');
                res.status(410).json({ 
                    error: 'Image link has expired',
                    isExpiredDalleUrl: true
                });
                return;
            }
            
            // Re-throw for general error handling
            throw fetchError;
        }
    } catch (error: any) {
        console.error('Error proxying image:', error.message);
        res.status(500).json({ error: 'Failed to proxy image' });
        return;
    }
}