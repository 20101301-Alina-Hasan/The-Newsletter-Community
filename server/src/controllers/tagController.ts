import { Request, Response } from "express";
import db from "../models";

export const getTags = async (req: Request, res: Response) => {
    try {
        const tags = await db.Tag.findAll();
        console.log(tags)
        res.status(200).json({ tags });
        return;
    } catch (error) {
        console.error("Error fetching upvotes:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};