import { Section, SectionTitle } from "@/components/ui/section";
import type { BankAccount } from "@/constants/weddingConfig";

/** Sinh URL ảnh QR từ STK nếu config không cung cấp sẵn. */
function qrSrc(acc: BankAccount): string {
  if (acc.qrUrl) return acc.qrUrl;
  const text = encodeURIComponent(`${acc.bank} ${acc.accountNumber} ${acc.holder}`);
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${text}`;
}

/** Hộp mừng cưới — STK + QR chuyển khoản 2 bên. */
export function GiftQr({ gifts }: { gifts: BankAccount[] }) {
  return (
    <Section id="gift">
      <SectionTitle eyebrow="With love" title="Hộp mừng cưới" />
      <div className="space-y-6">
        {gifts.map((acc, i) => (
          <div
            key={i}
            className="rounded-card border border-border bg-surface p-5 text-center shadow-sm"
          >
            <p className="text-xs uppercase tracking-widest text-gold">
              {acc.side === "groom" ? "Nhà trai" : "Nhà gái"}
            </p>
            <img
              src={qrSrc(acc)}
              alt={`QR ${acc.holder}`}
              className="mx-auto my-3 h-44 w-44 rounded-lg"
            />
            <p className="font-medium text-ink">{acc.holder}</p>
            <p className="text-sm text-muted">{acc.bank}</p>
            <p className="font-serif text-lg tracking-wider text-primary">
              {acc.accountNumber}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
