/**
 * Route paths tập trung — single source dùng cho router + <Seo> + nav links.
 * web-wedding hiện 1 trang thiệp (config-driven). Thêm site khác = thêm path.
 */
export const ROUTES = {
  home: "/", // clone modern (kiểu MeHappy / Site B)
  classic: "/classic", // clone classic (kiểu iWedding / Site A)
  admin: "/admin", // dashboard xem danh sách RSVP
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
