export interface PaymentResponse {
  success: boolean;
  preferenceId?: string;
  init_point?: string;
  error?: string;
}

export type PlanType = "forever" | "annual";

export interface Plan {
  type: PlanType;
  title: string;
  price: number;
  period: string;
  features: string[];
}

export interface CreatePaymentRequest {
  formData: any;
  planType: PlanType;
  planPrice: number;
}
