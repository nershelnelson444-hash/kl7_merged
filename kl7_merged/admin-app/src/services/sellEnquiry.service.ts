import { USE_MOCK_API } from "@/api/client";
import { mockDb, networkDelay, newId } from "@/api/mockDb";
import { supabase } from "@/config/SupabaseClient";
import type { SellEnquiry, SellEnquiryStatus } from "@/types";

// ─── Field mappers for bike_valuation_requests table ──────────────────────

function rowToSellEnquiry(row: Record<string, unknown>): SellEnquiry {
  return {
    id: row.id as string,
    brand: row.brand_make as string,
    model: row.model as string,
    year: row.year as number,
    mileage: row.mileage_km as number,
    engineCC: (row.engine_cc as number) ?? 0,
    bikeType: row.bike_type as SellEnquiry["bikeType"],
    condition: row.condition as SellEnquiry["condition"],
    askingPrice: (row.asking_price_rm as number) ?? 0,
    notes: (row.additional_notes as string) ?? "",
    fullName: row.full_name as string,
    phone: row.phone_number as string,
    email: row.email_address as string,
    preferredContact: row.preferred_contact as SellEnquiry["preferredContact"],
    status: (row.status as SellEnquiryStatus) ?? "new",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function sellEnquiryToRow(enquiry: Partial<SellEnquiry>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (enquiry.brand !== undefined) row.brand_make = enquiry.brand;
  if (enquiry.model !== undefined) row.model = enquiry.model;
  if (enquiry.year !== undefined) row.year = enquiry.year;
  if (enquiry.mileage !== undefined) row.mileage_km = enquiry.mileage;
  if (enquiry.engineCC !== undefined) row.engine_cc = enquiry.engineCC;
  if (enquiry.bikeType !== undefined) row.bike_type = enquiry.bikeType;
  if (enquiry.condition !== undefined) row.condition = enquiry.condition;
  if (enquiry.askingPrice !== undefined) row.asking_price_rm = enquiry.askingPrice;
  if (enquiry.notes !== undefined) row.additional_notes = enquiry.notes;
  if (enquiry.fullName !== undefined) row.full_name = enquiry.fullName;
  if (enquiry.phone !== undefined) row.phone_number = enquiry.phone;
  if (enquiry.email !== undefined) row.email_address = enquiry.email;
  if (enquiry.preferredContact !== undefined) row.preferred_contact = enquiry.preferredContact;
  if (enquiry.status !== undefined) row.status = enquiry.status;
  return row;
}

export const sellEnquiryService = {
  async list(): Promise<SellEnquiry[]> {
    if (USE_MOCK_API) {
      await networkDelay();
      const db = mockDb.get() as any;
      if (!db.sellEnquiries) {
        mockDb.update((d: any) => { d.sellEnquiries = MOCK_SELL_ENQUIRIES; });
      }
      const all: SellEnquiry[] = (mockDb.get() as any).sellEnquiries ?? [];
      return [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    const { data, error } = await supabase
      .from("bike_valuation_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => rowToSellEnquiry(row as unknown as Record<string, unknown>));
  },

  async get(id: string): Promise<SellEnquiry | undefined> {
    if (USE_MOCK_API) {
      await networkDelay(150, 300);
      const all: SellEnquiry[] = (mockDb.get() as any).sellEnquiries ?? [];
      return all.find((e) => e.id === id);
    }
    const { data, error } = await supabase
      .from("bike_valuation_requests")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      if ((error as { code?: string }).code === "PGRST116") return undefined;
      throw error;
    }
    return data ? rowToSellEnquiry(data as unknown as Record<string, unknown>) : undefined;
  },

  async updateStatus(id: string, status: SellEnquiryStatus): Promise<SellEnquiry> {
    if (USE_MOCK_API) {
      await networkDelay();
      let updated: SellEnquiry | undefined;
      mockDb.update((d: any) => {
        d.sellEnquiries = (d.sellEnquiries ?? []).map((e: SellEnquiry) => {
          if (e.id !== id) return e;
          updated = { ...e, status, updatedAt: new Date().toISOString() };
          return updated;
        });
      });
      if (!updated) throw new Error("Sell enquiry not found");
      return updated;
    }
    const { data, error } = await supabase
      .from("bike_valuation_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error("Sell enquiry not found");
    return rowToSellEnquiry(data as unknown as Record<string, unknown>);
  },

  async remove(id: string): Promise<void> {
    if (USE_MOCK_API) {
      await networkDelay();
      mockDb.update((d: any) => {
        d.sellEnquiries = (d.sellEnquiries ?? []).filter((e: SellEnquiry) => e.id !== id);
      });
      return;
    }
    const { error } = await supabase.from("bike_valuation_requests").delete().eq("id", id);
    if (error) throw error;
  },
};

// ─── Seed data ─────────────────────────────────────────────────────────────
export const MOCK_SELL_ENQUIRIES: SellEnquiry[] = [
  {
    id: "se-001", brand: "Royal Enfield", model: "Classic 350", year: 2021,
    mileage: 18500, engineCC: 349, bikeType: "Classic", condition: "Good",
    askingPrice: 145000, notes: "Single owner, all service records available, minor scratch on tank.",
    fullName: "Arjun Nair", phone: "+91 9876543210", email: "arjun@email.com",
    preferredContact: "WhatsApp", status: "new",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "se-002", brand: "KTM", model: "Duke 390", year: 2022,
    mileage: 9200, engineCC: 390, bikeType: "Naked", condition: "Like New",
    askingPrice: 265000, notes: "ABS model, Supermoto tyres fitted. Original tyres included.",
    fullName: "Sneha Menon", phone: "+91 9845123456", email: "sneha.m@gmail.com",
    preferredContact: "Phone Call", status: "contacted",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "se-003", brand: "Yamaha", model: "R15 V4", year: 2023,
    mileage: 4100, engineCC: 155, bikeType: "Sport", condition: "Like New",
    askingPrice: 170000, notes: "Racing blue. Stock bike, no modifications.",
    fullName: "Rahul Das", phone: "+91 9654321098", email: "rahul.das@outlook.com",
    preferredContact: "WhatsApp", status: "appraised",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "se-004", brand: "Bajaj", model: "Dominar 400", year: 2020,
    mileage: 32000, engineCC: 400, bikeType: "Adventure", condition: "Good",
    askingPrice: 175000, notes: "Long rides, maintained well. New chain and sprocket.",
    fullName: "Priya Krishnan", phone: "+91 9711223344", email: "priya.k@mail.com",
    preferredContact: "Email", status: "new",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "se-005", brand: "Honda", model: "CB300R", year: 2021,
    mileage: 12800, engineCC: 293, bikeType: "Naked", condition: "Good",
    askingPrice: 220000, notes: "Great commuter. Minor dent on right panel repaired.",
    fullName: "Vikram Pillai", phone: "+91 9988776655", email: "vikram@gmail.com",
    preferredContact: "WhatsApp", status: "deal_closed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];
