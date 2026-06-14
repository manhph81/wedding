/** Section trích dẫn lãng mạn căn giữa (đặc trưng iWedding). */
export function Quote({ text }: { text: string }) {
  return (
    <section className="bg-primary/5 px-6 py-16 text-center">
      <p className="mx-auto max-w-2xl font-serif text-xl italic leading-relaxed text-primary md:text-2xl">
        “{text}”
      </p>
    </section>
  );
}
