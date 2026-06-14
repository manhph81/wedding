import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminLogin } from "../../../server/handlers.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Method not allowed", message_id: "MSE_METHOD" });
  }
  const r = adminLogin(req.body);
  res.status(r.status).json(r.body);
}
