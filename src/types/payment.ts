export interface PaymentResponse {
  success: boolean;
  preferenceId?: string;
  init_point?: string;
  error?: string;
  details?: any;
}

export type PlanType = "forever" | "annual";

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

export interface CreatePaymentRequest {
  formData: any;
  planType: PlanType;
  planPrice: number;
  customer: CustomerData;
}
