declare module 'pagarme' {
  interface PagarmeClient {
    transactions: {
      create(options: {
        amount: number;
        payment_method: string;
        postback_url?: string;
        async?: boolean;
        capture?: boolean;
        soft_descriptor?: string;
        metadata?: any;
      }): Promise<{
        id: string;
        card: {
          payment_url?: string;
        };
        status: string;
        metadata: any;
      }>;
      find(options: { id: string }): Promise<{
        id: string;
        status: string;
        metadata: any;
        customer?: {
          email?: string;
          name?: string;
        };
      }>;
    };
  }

  interface PagarmeStatic {
    client: {
      connect(options: { api_key: string }): Promise<PagarmeClient>;
    };
  }

  const pagarme: PagarmeStatic;
  export default pagarme;
}
