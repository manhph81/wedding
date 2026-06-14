import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes";
import "./global.css";

/**
 * vite-react-ssg entry — pre-render static HTML mỗi route lúc build (SEO:
 * crawler thấy full nội dung thiệp thay vì <div id="root"> rỗng).
 */
export const createRoot = ViteReactSSG({ routes });
