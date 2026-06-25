import supabase from "@/config/supabaseclient";
import { mapCustomerEnquiry } from "@/types/customerEnquiry.types";
import type { CustomerEnquiryRow, CustomerEnquiry, CustomerEnquiryStatus } from "@/types/customerEnquiry.types";

const TABLE = "contact_messages";

export const customerEnquiryService = {

  // ── Fetch all messages, newest first ─────────────────────────────────────
  async list(): Promise<CustomerEnquiry[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data as CustomerEnquiryRow[]).map(mapCustomerEnquiry);
  },

  // ── Fetch a single message by id ──────────────────────────────────────────
  async get(id: string): Promise<CustomerEnquiry> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", Number(id))
      .single();

    if (error) throw new Error(error.message);
    return mapCustomerEnquiry(data as CustomerEnquiryRow);
  },

  // ── Update status ─────────────────────────────────────────────────────────
  async updateStatus(id: string, status: CustomerEnquiryStatus): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .update({ status })
      .eq("id", Number(id));

    if (error) throw new Error(error.message);
  },

  // ── Delete a message ──────────────────────────────────────────────────────
  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", Number(id));

    if (error) throw new Error(error.message);
  },
};
