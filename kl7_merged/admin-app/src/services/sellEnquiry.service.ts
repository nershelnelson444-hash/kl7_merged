import supabase from "@/config/supabaseclient";
import { mapSellEnquiry } from "@/types/sellEnquiry.types";
import type { SellEnquiryRow, SellEnquiry, SellEnquiryStatus } from "@/types/sellEnquiry.types";

const TABLE = "bike_valuation_requests";

export const sellEnquiryService = {

  // ── Fetch all enquiries, newest first ────────────────────────────────────
  async list(): Promise<SellEnquiry[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data as SellEnquiryRow[]).map(mapSellEnquiry);
  },

  // ── Fetch a single enquiry by id ─────────────────────────────────────────
  async get(id: string): Promise<SellEnquiry> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", Number(id))
      .single();

    if (error) throw new Error(error.message);
    return mapSellEnquiry(data as SellEnquiryRow);
  },

  // ── Update status ─────────────────────────────────────────────────────────
  async updateStatus(id: string, status: SellEnquiryStatus): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .update({ status })
      .eq("id", Number(id));

    if (error) throw new Error(error.message);
  },

  // ── Delete an enquiry ─────────────────────────────────────────────────────
  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", Number(id));

    if (error) throw new Error(error.message);
  },
};
