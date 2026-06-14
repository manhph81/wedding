import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createRsvp, isAdmin, listRsvps } from "../../server/handlers.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      // Danh sách RSVP chỉ cho admin.
      if (!isAdmin(req.headers.authorization)) {
        return res
          .status(401)
          .json({ message: "Cần đăng nhập admin", message_id: "MSE_ADMIN_UNAUTHORIZED" });
      }
      const r = await listRsvps();
      return res.status(r.status).json(r.body);
    }
    if (req.method === "POST") {
      const r = await createRsvp(req.body);
      return res.status(r.status).json(r.body);
    }
    res.status(405).json({ message: "Method not allowed", message_id: "MSE_METHOD" });
  } catch (e) {
    res.status(500).json({ message: (e as Error).message, message_id: "MSE_INTERNAL" });
  }
}
