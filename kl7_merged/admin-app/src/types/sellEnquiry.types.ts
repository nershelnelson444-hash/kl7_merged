// ─── Status (not a DB column — managed in app state via a separate status column)
// If you later add a status column to the table, this stays the same.
import type {
  SellEnquiry as CanonicalSellEnquiry,
  SellBikeType,
  SellCondition,
  PreferredContact,
} from "./index";

export type SellEnquiryStatus = CanonicalSellEnquiry["status"];

// ─── Raw row from Supabase (snake_case, matches bike_valuation_requests exactly)
export interface SellEnquiryRow {
  id: number;
  brand_make: string;
  model: string;
  year: number;
  mileage_km: number;
  engine_cc: number;
  bike_type: string;
  condition: string;
  asking_price_rm: number;
  additional_notes?: string | null;
  full_name: string;
  phone_number: string;
  email_address: string;
  preferred_contact: string;
  status: SellEnquiryStatus;   // add this column — see note below
  created_at: string;
  updated_at?: string;
}

// ─── Normalised shape used throughout the UI (camelCase)
export interface SellEnquiry {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  engineCC: number;
  bikeType: SellBikeType;
  condition: SellCondition;
  askingPrice: number;
  notes?: string | null;
  fullName: string;
  phone: string;
  email: string;
  preferredContact: PreferredContact;
  status: SellEnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Mapper: DB row → UI shape
export function mapSellEnquiry(row: SellEnquiryRow): SellEnquiry {
  return {
    id: String(row.id),
    brand: row.brand_make,
    model: row.model,
    year: row.year,
    mileage: row.mileage_km,
    engineCC: row.engine_cc,
    bikeType: row.bike_type as SellEnquiry["bikeType"],
    condition: row.condition as SellEnquiry["condition"],
    askingPrice: row.asking_price_rm,
    notes: row.additional_notes,
    fullName: row.full_name,
    phone: row.phone_number,
    email: row.email_address,
    preferredContact: row.preferred_contact as SellEnquiry["preferredContact"],
    status: row.status ?? "new",
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? row.created_at,
  };
}
