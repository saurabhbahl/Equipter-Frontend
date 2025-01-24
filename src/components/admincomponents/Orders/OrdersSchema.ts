// order interface
export interface IOrder {
  id: string;
  webquote_id: string;
  order_status: string;
  estimated_completion_date: string;
  actual_completion_date: string;
  created_at: string;
  updated_at: string;
  webquote: {
    product_name: string;
    state_id: string;
  }
  product: {
    product_id: string;
    name: string;
    product_url: string;
    product_price: string;
    product_qty: string;
    product_total_cost: string;
  }
}
