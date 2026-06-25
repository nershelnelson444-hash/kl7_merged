// ─── Status (app-managed — add the column via SQL below if not exists)
export type CustomerEnquiryStatus = "new" | "read" | "replied" | "closed";

// ─── Raw row from Supabase (snake_case, matches contact_messages exactly)
export interface CustomerEnquiryRow {
  id: number;
  full_name: string;
  email_address: string;
  phone_number?: string | null;
  subject: string;
  message?: string | null;
  status: CustomerEnquiryStatus;
  created_at: string;
}

// ─── Normalised shape used throughout the UI (camelCase)
export interface CustomerEnquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: CustomerEnquiryStatus;
  createdAt: string;
}

// ─── Mapper: DB row → UI shape
export function mapCustomerEnquiry(row: CustomerEnquiryRow): CustomerEnquiry {
  return {
    id: String(row.id),
    fullName: row.full_name,
    email: row.email_address,
    phone: row.phone_number ?? "",
    subject: row.subject,
    message: row.message ?? "",
    status: row.status ?? "new",
    createdAt: row.created_at,
  };
}
