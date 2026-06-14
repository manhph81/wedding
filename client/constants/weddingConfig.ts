/**
 * Cấu hình thiệp cưới — tách dữ liệu khỏi code: MỘT template, NHIỀU thiệp.
 * Đổi cặp đôi/sự kiện/ảnh/STK/hiệu ứng chỉ sửa file này (hoặc nạp từ API).
 *
 * Dữ liệu dưới đây là MẪU/placeholder — KHÔNG phải dữ liệu thật của 2 site gốc.
 */

export type Person = {
  role: "groom" | "bride";
  name: string;
  fullName: string;
  bio?: string;
  photo: string;
  parents?: { father?: string; mother?: string };
};

export type StoryMilestone = {
  date: string;
  title: string;
  body: string;
  photo?: string;
};

export type WeddingEvent = {
  side: "groom" | "bride";
  title: string;
  /** ISO datetime cho countdown + add-to-calendar. */
  datetime: string;
  /** Hiển thị ngày dương + âm lịch. */
  solarDate: string;
  lunarDate?: string;
  venue: string;
  address: string;
  mapUrl?: string;
};

export type BankAccount = {
  side: "groom" | "bride";
  holder: string;
  bank: string;
  accountNumber: string;
  /** URL ảnh QR (VietQR / api.qrserver.com). Để trống → sinh từ STK. */
  qrUrl?: string;
};

export type EffectSettings = {
  music: { enabled: boolean; src: string; autoPlay: boolean };
  falling: { enabled: boolean; color: string; density: number; speed: number };
  autoScroll: { enabled: boolean; speed: number };
  envelope: { enabled: boolean };
  guestNotification: { enabled: boolean };
};

export type WeddingConfig = {
  /** Phân biệt biến thể layout: "modern" (MeHappy) | "classic" (iWedding). */
  variant: "modern" | "classic";
  locale: "vi";
  seo: { title: string; description: string; ogImage?: string };
  couple: { groom: Person; bride: Person };
  /** Ngày cưới chính cho hero + countdown (ISO). */
  weddingDate: string;
  hero: { coverPhoto: string; tagline: string };
  invitation: { greeting: string };
  story: StoryMilestone[];
  events: WeddingEvent[];
  gallery: string[];
  gifts: BankAccount[];
  effects: EffectSettings;
};

/**
 * Ảnh cưới mẫu (Unsplash, free license) — thay bằng ảnh thật khi triển khai.
 * `img(id, w, h)` ghép URL Unsplash đã crop đúng tỉ lệ.
 */
const img = (id: string, w = 800, h = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=75`;

const GALLERY_IDS = [
  "1511285560929-80b456fea0bc",
  "1519741497674-611481863552",
  "1606216794074-735e91aa2c92",
  "1583939003579-730e3918a45a",
  "1525258946800-98cfd641d0de",
  "1606800052052-a08af7148866",
  "1460978812857-470ed1c77af0",
  "1532712938310-34cb3982ef74",
];

export const weddingConfig: WeddingConfig = {
  variant: "modern",
  locale: "vi",
  seo: {
    title: "Thư mời cưới • Diên Tuấn & Khánh Linh",
    description:
      "Trân trọng kính mời bạn đến chung vui trong ngày hạnh phúc của chúng tôi.",
    ogImage: img("1519225421980-715cb0215aed", 1200, 630),
  },
  weddingDate: "2026-12-20T11:00:00+07:00",
  hero: {
    coverPhoto: img("1519225421980-715cb0215aed", 1000, 1300),
    tagline: "We're getting married",
  },
  invitation: {
    greeting: "Trân trọng kính mời",
  },
  couple: {
    groom: {
      role: "groom",
      name: "Diên Tuấn",
      fullName: "Hồ Diên Tuấn",
      bio: "Chàng trai yêu thích sự bình yên và những chuyến đi.",
      photo: img("1522673607200-164d1b6ce486"),
      parents: { father: "Ông Hồ Văn A", mother: "Bà Lê Thị B" },
    },
    bride: {
      role: "bride",
      name: "Khánh Linh",
      fullName: "Hoàng Thị Khánh Linh",
      bio: "Cô gái dịu dàng, thích cà phê và ánh nắng buổi sáng.",
      photo: img("1537633552985-df8429e8048b"),
      parents: { father: "Ông Hoàng Văn C", mother: "Bà Phạm Thị D" },
    },
  },
  story: [
    {
      date: "Mùa đông 2020",
      title: "Lần đầu gặp gỡ",
      body: "Tình cờ quen nhau qua một người bạn chung, và rồi mọi thứ bắt đầu.",
      photo: img("1535254973040-607b474cb50d", 700, 500),
    },
    {
      date: "2022",
      title: "Hẹn hò",
      body: "Những buổi tối đi dạo, những chuyến đi xa cùng nhau.",
      photo: img("1591604466107-ec97de577aff", 700, 500),
    },
    {
      date: "Tháng 10, 2025",
      title: "Lời cầu hôn",
      body: "Dưới ánh hoàng hôn, anh đã ngỏ lời và em gật đầu.",
      photo: img("1519671482749-fd09be7ccebf", 700, 500),
    },
  ],
  events: [
    {
      side: "bride",
      title: "Lễ Vu Quy (Nhà gái)",
      datetime: "2026-12-19T10:00:00+07:00",
      solarDate: "19/12/2026",
      lunarDate: "01/11 Âm lịch",
      venue: "Tư gia nhà gái",
      address: "Số 1, Đường ABC, Quận X, TP. HCM",
      mapUrl: "https://maps.google.com/?q=10.762622,106.660172",
    },
    {
      side: "groom",
      title: "Lễ Thành Hôn (Nhà trai)",
      datetime: "2026-12-20T11:00:00+07:00",
      solarDate: "20/12/2026",
      lunarDate: "02/11 Âm lịch",
      venue: "Trung tâm tiệc cưới DEF",
      address: "Số 99, Đường XYZ, Quận Y, TP. HCM",
      mapUrl: "https://maps.google.com/?q=10.776889,106.700806",
    },
  ],
  gallery: GALLERY_IDS.map((id) => img(id, 600, 800)),
  gifts: [
    {
      side: "groom",
      holder: "HO DIEN TUAN",
      bank: "Vietcombank",
      accountNumber: "0123456789",
    },
    {
      side: "bride",
      holder: "HOANG THI KHANH LINH",
      bank: "Techcombank",
      accountNumber: "9876543210",
    },
  ],
  effects: {
    music: {
      enabled: true,
      // Pachelbel — Canon in D (Kevin MacLeod, public domain, Wikimedia). Nhẹ nhàng.
      src: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3",
      autoPlay: true,
    },
    falling: { enabled: true, color: "#965D5D", density: 18, speed: 8 },
    autoScroll: { enabled: false, speed: 5 },
    envelope: { enabled: true },
    guestNotification: { enabled: true },
  },
};
