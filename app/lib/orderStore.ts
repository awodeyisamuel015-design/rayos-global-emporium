import { supabase } from "./supabase";

export type OrderStatus =
  | "pending"
  | "processing"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  total: number;
  status: OrderStatus;
  created_at: string;
};

export async function createOrder(
  customer_name: string,
  phone: string,
  address: string,
  total: number
) {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        customer_name,
        phone,
        address,
        total,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function createOrderItems(
  items: any[]
) {
  const { error } = await supabase
    .from("order_items")
    .insert(items);

  if (error) throw error;
}

export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data as Order[];
}
