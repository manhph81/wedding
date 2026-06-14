import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Section, SectionTitle } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRsvp } from "@/hooks/useRsvp";
import { ApiError } from "@/lib/api";

const schema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên"),
  attendance: z.enum(["yes", "no"]),
  // Để trống → hiện placeholder; bỏ trống khi submit sẽ mặc định = 1 (xử lý ở onSubmit).
  guests: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
    z.number().int().min(1, "Tối thiểu 1 người").max(20, "Tối đa 20 người").optional(),
  ),
  side: z.enum(["groom", "bride", "both"]).optional(),
  message: z.string().trim().max(500).optional(),
});
type FormValues = z.infer<typeof schema>;

/** Xác nhận tham dự — react-hook-form + Zod → mutation → toast. */
export function Rsvp() {
  const rsvp = useRsvp();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { attendance: "yes" },
  });

  const onSubmit = (values: FormValues) => {
    // Bỏ trống "số người" → mặc định 1 người.
    rsvp.mutate(
      { ...values, guests: values.guests ?? 1 },
      {
      onSuccess: () => {
        toast.success("Cảm ơn bạn đã xác nhận!");
        reset({ attendance: "yes" });
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
    <Section id="rsvp">
      <SectionTitle eyebrow="RSVP" title="Xác nhận tham dự" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto">
        <div>
          <Input placeholder="Tên của bạn" {...register("name")} />
          {errors.name && (
            <p className="mt-1 text-xs text-primary">{errors.name.message}</p>
          )}
        </div>

        <Controller
          control={control}
          name="attendance"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2">
              {(["yes", "no"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => field.onChange(opt)}
                  className={cn(
                    "h-11 rounded-xl border text-sm transition-colors",
                    field.value === opt
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-ink",
                  )}
                >
                  {opt === "yes" ? "Tôi sẽ đến" : "Tiếc là không"}
                </button>
              ))}
            </div>
          )}
        />

        <div>
          <Input
            type="number"
            min={1}
            placeholder="Số người tham dự"
            {...register("guests")}
          />
          {errors.guests && (
            <p className="mt-1 text-xs text-primary">{errors.guests.message}</p>
          )}
        </div>

        <Textarea placeholder="Lời nhắn (không bắt buộc)" {...register("message")} />

        <Button type="submit" className="w-full" disabled={rsvp.isPending}>
          {rsvp.isPending ? "Đang gửi..." : "Gửi xác nhận"}
        </Button>
      </form>
    </Section>
  );
}
