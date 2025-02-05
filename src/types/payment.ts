export type PaymentMethod = "credit_card" | "pix";
export type PlanType = "forever" | "annual";

export interface CardData {
  number: string;
  holder_name: string;
  exp_month: number;
  exp_year: number;
  cvv: string;
}

export interface CustomerData {
  name: string;
  email: string;
  document_number: string;
  phone_numbers: string[];
}

export interface CreatePaymentRequest {
  formData: any;
  planType: PlanType;
  planPrice: number;
  paymentMethod: PaymentMethod;
  customer: CustomerData;
  card?: CardData;
}

export interface PaymentResponse {
  success: boolean;
  error?: string;
  order?: {
    id: string;
  };
  preferenceId?: string;
  qr_code?: string;
  qr_code_url?: string;
  pix_key?: string;
  expires_at?: string;
  init_point?: string;
}
