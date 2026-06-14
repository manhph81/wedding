import { createServer } from "./index";

const port = Number(process.env.PORT ?? 8000);
const app = createServer();

app.listen(port, () => {
  console.log(`[server] mock API listening on http://localhost:${port}`);
});
