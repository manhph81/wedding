import { Head } from "vite-react-ssg";

/**
 * <head> per-route. Dùng `Head` của vite-react-ssg → thẻ được render vào HTML
 * tĩnh lúc build (SEO: crawler thấy title/meta thật), đồng thời cập nhật client.
 */
export function Seo({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image?: string;
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
