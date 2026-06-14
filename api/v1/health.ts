import type { VercelRequest, VercelResponse } from "@vercel/node";
import { health } from "../../server/handlers.js";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const r = await health();
    res.status(r.status).json(r.body);
  } catch (e) {
    res.status(500).json({ message: (e as Error).message, message_id: "MSE_INTERNAL" });
  }
}
