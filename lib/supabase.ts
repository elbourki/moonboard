import { createClient } from "@supabase/supabase-js";

export type Block = {
  time: Date;
  block: number;
  network: string;
};

export type Channel = {
  uid: string;
  channel: string;
  attributes: { [k: string]: any };
};

export type Subscription = {
  id: number;
  uid: string;
  network: string;
  topic: string;
  channels: string[];
  sent: number;
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY!
);
