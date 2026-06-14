import { Seo } from "@/components/Seo";
import { VariantSwitch } from "@/components/VariantSwitch";
import { ROUTES } from "@/constants/routes";
import { weddingConfig } from "@/constants/weddingConfig";
import { Navbar } from "@/components/classic/Navbar";
import { ClassicHero } from "@/components/classic/ClassicHero";
import { ClassicCouple } from "@/components/classic/ClassicCouple";
import { Quote } from "@/components/classic/Quote";
import { MusicPlayer } from "@/components/wedding/MusicPlayer";
import { Countdown } from "@/components/wedding/Countdown";
import { StoryTimeline } from "@/components/wedding/StoryTimeline";
import { Events } from "@/components/wedding/Events";
import { Gallery } from "@/components/wedding/Gallery";
import { Rsvp } from "@/components/wedding/Rsvp";
import { Wishes } from "@/components/wedding/Wishes";
import { GiftQr } from "@/components/wedding/GiftQr";
import { Footer } from "@/components/wedding/Footer";

/**
 * Clone CLASSIC (kiểu iWedding / Site A) — website đa-section, responsive
 * desktop + mobile, có navbar cố định. Dùng chung dữ liệu `weddingConfig`,
 * khác bản modern ở layout & điều hướng (không envelope/falling).
 */
export default function Classic() {
  const c = weddingConfig;
  const { groom, bride } = c.couple;
  const initials = `${groom.name[0]}${bride.name[0]}`;

  return (
    <div className="bg-bg">
      <Seo
        title={`${c.seo.title} • Classic`}
        description={c.seo.description}
        image={c.seo.ogImage}
      />

      <Navbar initials={initials} />
      {c.effects.music.enabled && <MusicPlayer src={c.effects.music.src} />}
      <VariantSwitch to={ROUTES.home} label="Xem bản Modern" />

      <ClassicHero config={c} />

      {/* Nội dung gói trong container hẹp → giống cột nội dung của website cưới */}
      <div className="mx-auto max-w-3xl">
        <ClassicCouple groom={groom} bride={bride} />
        <Countdown date={c.weddingDate} />
        <StoryTimeline story={c.story} />
        <Quote text="Dù ta có trở thành ai, chỉ tình yêu là ở lại." />
        <Events events={c.events} />
        <Gallery photos={c.gallery} />
        <Rsvp />
        <Wishes />
        <GiftQr gifts={c.gifts} />
      </div>

      <Footer config={c} />
    </div>
  );
}
