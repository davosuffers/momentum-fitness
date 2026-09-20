import { sqliteTable, text } from "drizzle-orm/sqlite-core";
export const leads = sqliteTable("Leads", {
  id: text("id").primaryKey(),
  businessName: text("business_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  businessUrl: text("business_url").notNull(),
  monthlyAdSpend: text("monthly_ad_spend").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").notNull(),
});
