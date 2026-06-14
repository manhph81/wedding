import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Section, SectionTitle } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useWishes, useCreateWish } from "@/hooks/useWishes";
import { ApiError } from "@/lib/api";

const schema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên"),
  message: z.string().trim().min(1, "Vui lòng nhập lời chúc").max(500),
});
type FormValues = z.infer<typeof schema>;

/** Sổ lưu bút — danh sách lời chúc + form gửi mới. */
export function Wishes() {
  const { data, isLoading } = useWishes();
  const create = useCreateWish();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    create.mutate(values, {
      onSuccess: () => {
        toast.success("Cảm ơn lời chúc của bạn!");
        reset({ name: "", message: "" });
      },
      onError: (err) =>
        toast.error(
          err instanceof ApiError && err.message
            ? err.message
            : "Không gửi được, vui lòng thử lại",
        ),
    });
  };

  return (
    <Section id="wishes" className="bg-primary/5">
      <SectionTitle eyebrow="Guestbook" title="Sổ lưu bút" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 max-w-sm mx-auto mb-8">
        <div>
          <Input placeholder="Tên của bạn" {...register("name")} />
          {errors.name && (
            <p className="mt-1 text-xs text-primary">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Textarea placeholder="Gửi lời chúc tới cô dâu chú rể..." {...register("message")} />
          {errors.message && (
            <p className="mt-1 text-xs text-primary">{errors.message.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={create.isPending}>
          {create.isPending ? "Đang gửi..." : "Gửi lời chúc"}
        </Button>
      </form>

      <div className="space-y-3 max-w-sm mx-auto">
        {isLoading && <p className="text-center text-sm text-muted">Đang tải...</p>}
        {data?.wishes.map((w) => (
          <div
            key={w.id}
            className="rounded-card border border-border bg-surface p-4 shadow-sm"
          >
            <p className="font-script text-2xl text-primary leading-tight">{w.name}</p>
            <p className="mt-1 text-sm text-ink">{w.message}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
