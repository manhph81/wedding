import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createWish, listWishes } from "../../server/handlers.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      const r = await listWishes();
      return res.status(r.status).json(r.body);
    }
    if (req.method === "POST") {
      const r = await createWish(req.body);
      return res.status(r.status).json(r.body);
    }
    res.status(405).json({ message: "Method not allowed", message_id: "MSE_METHOD" });
  } catch (e) {
    res.status(500).json({ message: (e as Error).message, message_id: "MSE_INTERNAL" });
  }
}
