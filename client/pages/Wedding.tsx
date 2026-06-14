import { Seo } from "@/components/Seo";
import { VariantSwitch } from "@/components/VariantSwitch";
import { ROUTES } from "@/constants/routes";
import { weddingConfig } from "@/constants/weddingConfig";
import { Envelope } from "@/components/wedding/Envelope";
import { MusicPlayer } from "@/components/wedding/MusicPlayer";
import { FallingEffect } from "@/components/wedding/FallingEffect";
import { GuestNotification } from "@/components/wedding/GuestNotification";
import { Hero } from "@/components/wedding/Hero";
import { Invitation } from "@/components/wedding/Invitation";
import { Couple } from "@/components/wedding/Couple";
import { Countdown } from "@/components/wedding/Countdown";
import { StoryTimeline } from "@/components/wedding/StoryTimeline";
import { Events } from "@/components/wedding/Events";
import { Gallery } from "@/components/wedding/Gallery";
import { Rsvp } from "@/components/wedding/Rsvp";
import { Wishes } from "@/components/wedding/Wishes";
import { GiftQr } from "@/components/wedding/GiftQr";
import { Footer } from "@/components/wedding/Footer";

/**
 * Trang thiệp cưới — config-driven (một template, nhiều thiệp).
 * Layout "modern" (MeHappy): mobile-first, mở thiệp + nhạc + hiệu ứng rơi.
 */
export default function Wedding() {
  const c = weddingConfig;
  const fx = c.effects;

  return (
    <main className="card-shell">
      <Seo title={c.seo.title} description={c.seo.description} image={c.seo.ogImage} />

      {fx.envelope.enabled && (
        <Envelope
          groomName={c.couple.groom.name}
          brideName={c.couple.bride.name}
          coverPhoto={c.hero.coverPhoto}
          musicEnabled={fx.music.enabled}
        />
      )}
      {fx.music.enabled && <MusicPlayer src={fx.music.src} />}
      <VariantSwitch to={ROUTES.classic} label="Xem bản Classic" />
      {fx.falling.enabled && (
        <FallingEffect
          color={fx.falling.color}
          density={fx.falling.density}
          speed={fx.falling.speed}
        />
      )}
      {fx.guestNotification.enabled && (
        <GuestNotification enabled={fx.guestNotification.enabled} />
      )}

      <Hero config={c} />
      <Invitation greeting={c.invitation.greeting} />
      <Couple groom={c.couple.groom} bride={c.couple.bride} />
      <Countdown date={c.weddingDate} />
      <StoryTimeline story={c.story} />
      <Events events={c.events} />
      <Gallery photos={c.gallery} />
      <Rsvp />
      <Wishes />
      <GiftQr gifts={c.gifts} />
      <Footer config={c} />
    </main>
  );
}
