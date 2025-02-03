// Tipos para a API v5 do Pagar.me

export interface PagarmeOrder {
  id: string;
  code: string;
  amount: number;
  currency: string;
  closed: boolean;
  status: OrderStatus;
  payment: PagarmePayment;
  customer?: PagarmeCustomer;
  items: PagarmeOrderItem[];
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  charges: Array<{
    id: string;
    code: string;
    gateway_id: string;
    amount: number;
    status: string;
    currency: string;
    payment_method: string;
    paid_at: string | null;
    created_at: string;
    updated_at: string;
    customer: PagarmeCustomer;
    last_transaction: {
      id: string;
      transaction_type: string;
      gateway_id: string;
      amount: number;
      status: string;
      success: boolean;
      created_at: string;
      updated_at: string;
      gateway_response: {
        code: string;
        errors: Array<any>;
      };
    };
  }>;
}

export type OrderStatus = 
  | 'pending'
  | 'paid'
  | 'canceled'
  | 'failed'
  | 'processing';

export interface PagarmePayment {
  payment_method: 'credit_card' | 'pix' | 'boleto';
  credit_card?: {
    installments: number;
    statement_descriptor?: string;
    card: {
      number: string;
      holder_name: string;
      exp_month: number;
      exp_year: number;
      cvv: string;
    };
  };
  pix?: {
    expires_in: number;
  };
  boleto?: {
    instructions: string;
    due_at: string;
  };
}

export interface PagarmeCustomer {
  name: string;
  email: string;
  document: string;
  type: 'individual' | 'company';
  external_id?: string;
  phones?: {
    mobile_phone?: {
      country_code: string;
      area_code: string;
      number: string;
    };
  };
}

export interface PagarmeOrderItem {
  amount: number;
  description: string;
  quantity: number;
  code?: string;
}

export interface PagarmeWebhook {
  id: string;
  type: WebhookType;
  data: {
    id: string;
    code: string;
    amount: number;
    currency: string;
    closed: boolean;
    status: OrderStatus;
    created_at: string;
    updated_at: string;
  };
}

export type WebhookType = 
  | 'order.paid'
  | 'order.payment_failed'
  | 'order.canceled'
  | 'order.processing'
  | 'order.created';

export interface CreateOrderResponse {
  id: string;
  code: string;
  amount: number;
  currency: string;
  closed: boolean;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  charges: Array<{
    id: string;
    code: string;
    gateway_id: string;
    amount: number;
    status: string;
    currency: string;
    payment_method: string;
    paid_at: string | null;
    created_at: string;
    updated_at: string;
    customer: PagarmeCustomer;
    last_transaction: {
      id: string;
      transaction_type: string;
      gateway_id: string;
      amount: number;
      status: string;
      success: boolean;
      created_at: string;
      updated_at: string;
      gateway_response: {
        code: string;
        errors: Array<any>;
      };
    };
  }>;
}
