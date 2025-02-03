export interface PaymentResponse {
  success: boolean;
  preferenceId?: string;
  init_point?: string;
  error?: string;
  details?: any;
  qr_code?: string;
  qr_code_url?: string;
  pix_key?: string;
  expires_at?: string;
}

export type PlanType = "forever" | "annual";
export type PaymentMethod = "credit_card" | "pix";

export interface Plan {
  type: PlanType;
  title: string;
  price: number;
  period: string;
  features: string[];
}

export interface CustomerData {
  name: string;
  email: string;
  document_number: string;
  phone_numbers: string[];
}

export interface CardData {
  number: string;
  holder_name: string;
  exp_month: number;
  exp_year: number;
  cvv: string;
}

export interface CreatePaymentRequest {
  formData: any;
  planType: PlanType;
  planPrice: number;
  customer: CustomerData;
  paymentMethod: PaymentMethod;
  card?: CardData;
}
