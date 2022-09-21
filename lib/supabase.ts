import { createClient } from "@supabase/supabase-js";

export type Channel = {
  uid: string;
  channel: string;
  attributes: { [k: string]: any };
};

export type Subscription = {
  uid: string;
  network: string;
  topic: string;
  channels: string[];
};

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);
