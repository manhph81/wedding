import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import type {
  ApiErrorBody,
  CreateWishResponse,
  HealthResponse,
  Rsvp,
  RsvpResponse,
  Wish,
  WishesResponse,
} from "../shared/api";

/** ID đơn giản cho mock (không cần crypto). */
let counter = 1000;
const nextId = (prefix: string) => `${prefix}_${++counter}`;

export function createServer(): Express {
  const app = express();
  app.use(express.json());

  // In-memory store (mất khi restart) — đủ cho dev/demo.
  const wishes: Wish[] = [
    {
      id: nextId("wish"),
      name: "Gia đình bên nội",
      message: "Chúc hai cháu trăm năm hạnh phúc, sớm sinh quý tử!",
      createdAt: new Date().toISOString(),
    },
  ];
  const rsvps: Rsvp[] = [];

  app.get("/api/v1/health", (_req, res) => {
    const body: HealthResponse = { ok: true };
    res.json(body);
  });

  // GET danh sách lời chúc (mới nhất trước).
  app.get("/api/v1/wishes", (_req, res) => {
    const body: WishesResponse = {
      wishes: [...wishes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    };
    res.json(body);
  });

  // POST lời chúc mới.
  app.post("/api/v1/wishes", (req, res) => {
    const { name, message } = req.body ?? {};
    if (typeof name !== "string" || !name.trim() || typeof message !== "string" || !message.trim()) {
      return fail(res, 400, "Vui lòng nhập tên và lời chúc", "MSE_WISH_BAD_REQUEST");
    }
    const wish: Wish = {
      id: nextId("wish"),
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    wishes.push(wish);
    const body: CreateWishResponse = { ok: true, wish };
    res.status(201).json(body);
  });

  // POST xác nhận tham dự.
  app.post("/api/v1/rsvp", (req, res) => {
    const { name, attendance, guests, side, message } = req.body ?? {};
    if (typeof name !== "string" || !name.trim()) {
      return fail(res, 400, "Vui lòng nhập tên", "MSE_RSVP_BAD_REQUEST");
    }
    if (attendance !== "yes" && attendance !== "no") {
      return fail(res, 400, "Lựa chọn tham dự không hợp lệ", "MSE_RSVP_BAD_ATTEND");
    }
    const rsvp: Rsvp = {
      id: nextId("rsvp"),
      name: name.trim(),
      attendance,
      guests: Number.isFinite(guests) ? Number(guests) : 1,
      side: side === "groom" || side === "bride" || side === "both" ? side : undefined,
      message: typeof message === "string" ? message.trim() : undefined,
      createdAt: new Date().toISOString(),
    };
    rsvps.push(rsvp);
    const body: RsvpResponse = { ok: true, rsvp };
    res.status(201).json(body);
  });

  // 404 — same envelope cho mọi error.
  app.use((req, res) => {
    fail(res, 404, `Not found: ${req.method} ${req.path}`, "MSE_NOT_FOUND");
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    fail(res, 500, err.message || "Internal server error", "MSE_INTERNAL");
  });

  return app;
}

function fail(res: Response, status: number, message: string, messageId: string) {
  const body: ApiErrorBody = { message, message_id: messageId };
  res.status(status).json(body);
}
