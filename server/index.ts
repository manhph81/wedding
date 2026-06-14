import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import type { ApiErrorBody } from "../shared/api";
import {
  adminLogin,
  createRsvp,
  createWish,
  health,
  isAdmin,
  listRsvps,
  listWishes,
  type Result,
} from "./handlers";

/** Express server cho local dev/Docker. Logic ở `handlers.ts` (dùng chung với
 *  Vercel functions trong `api/`). */
export function createServer(): Express {
  const app = express();

  // Body parser có điều kiện (local: parse stream; nếu đã có body thì bỏ qua).
  const jsonParser = express.json();
  app.use((req, res, next) => {
    if (req.body !== undefined) return next();
    jsonParser(req, res, next);
  });

  const send = (res: Response, r: Result) => res.status(r.status).json(r.body);

  app.get("/api/v1/health", async (_req, res) => send(res, await health()));

  app.get("/api/v1/wishes", async (_req, res) => send(res, await listWishes()));
  app.post("/api/v1/wishes", async (req, res) => send(res, await createWish(req.body)));

  app.get("/api/v1/rsvp", async (req, res) => {
    if (!isAdmin(req.headers.authorization)) {
      return fail(res, 401, "Cần đăng nhập admin", "MSE_ADMIN_UNAUTHORIZED");
    }
    send(res, await listRsvps());
  });
  app.post("/api/v1/rsvp", async (req, res) => send(res, await createRsvp(req.body)));

  app.post("/api/v1/admin/login", (req, res) => send(res, adminLogin(req.body)));

  app.use((req, res) => {
    fail(res, 404, `Not found: ${req.method} ${req.path}`, "MSE_NOT_FOUND");
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[server] error", err);
    fail(res, 500, err.message || "Internal server error", "MSE_INTERNAL");
  });

  return app;
}

function fail(res: Response, status: number, message: string, messageId: string) {
  const body: ApiErrorBody = { message, message_id: messageId };
  res.status(status).json(body);
}
