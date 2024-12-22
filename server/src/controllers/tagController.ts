import { Request, Response } from "express";
import db from "../models";


export const getTagByID = async (req: Request, res: Response) => {
    try {
        const tag = await db.Tag.findByPk(req.params.tag_id);
        res.status(200).json({ tag });
        return;
    } catch (error) {
        console.error("Error fetching tag:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
}

export const getTags = async (req: Request, res: Response) => {
    try {
        const tags = await db.Tag.findAll();
        res.status(200).json({ tags });
        return;
    } catch (error) {
        console.error("Error fetching upvotes:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};