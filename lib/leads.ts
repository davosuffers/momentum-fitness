import { z } from "zod";
export const spendOptions = ["Under $1K", "$1K–$5K", "$5K–$10K", "$10K+"] as const;
const businessUrl = z.string().trim().min(1, "Please enter your business URL.").max(500, "Your URL is too long.").transform((value, ctx) => {
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".") || url.username || url.password) throw new Error();
    return url.toString();
  } catch {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid business URL, such as yourclub.com." });
    return z.NEVER;
  }
});
const phone = z.string().trim().max(30, "Your phone number is too long.")
  .refine(value => value === "" || /^\+?\d[\d\s().-]{5,29}$/.test(value), "Please enter a valid phone number, such as +1 555 123 4567.")
  .optional().default("");
export const leadSchema = z.object({
  businessName: z.string().trim().min(2, "Please enter your business name.").max(120, "Your business name is too long."),
  email: z.string().trim().max(254).email("Please enter a valid email address.").transform(value => value.toLowerCase()),
  phone,
  businessUrl,
  monthlyAdSpend: z.enum(spendOptions, { errorMap: () => ({ message: "Please select your monthly ad spend." }) }),
  website: z.string().max(200).optional().default(""),
});
export const leadRequestSchema = leadSchema.extend({ requestId: z.string().uuid("Invalid request. Please refresh and try again.") });
export type LeadInput = z.input<typeof leadSchema>;
