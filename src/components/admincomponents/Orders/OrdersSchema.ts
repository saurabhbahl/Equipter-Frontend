// order interface
export interface Iorder {
  id: string;
  webquote_id: string;
  order_status: string;
  estimated_completion_date: string;
  actual_completion_date: string;
  created_at: string;
  updated_at: string;
  webquote: {
    product_name: string;
  }
  product: {
    name: string;
    product_url: string;
  }
}
