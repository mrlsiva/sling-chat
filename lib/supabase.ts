import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Lead = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  situation_type?: string;
  key_problem?: string;
  urgency_level?: string;
  user_intent?: string;
  additional_notes?: string;
  created_at?: string;
};

export type Conversation = {
  id?: string;
  messages: object;
  extracted_data: object;
  created_at?: string;
};
