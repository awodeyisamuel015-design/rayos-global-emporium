import { supabase } from "./supabase";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
};

let listeners: Array<() => void> = [];

/* notify UI updates */
function emit() {
  listeners.forEach((fn) => fn());
}

export const productStore = {
  /* GET ALL PRODUCTS */
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("getAll error:", error);
      return [];
    }

    return (data as Product[]) || [];
  },

  /* GET SINGLE PRODUCT */
  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("getById error:", error);
      return null;
    }

    return (data as Product) || null;
  },

  /* ADD PRODUCT */
  async addProduct(product: Product) {
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select();

    console.log("Inserted data:", data);
    console.log("Insert error:", error);

    if (error) {
      console.error("addProduct error:", error);
      return;
    }

    emit();
  },

  /* REMOVE PRODUCT */
  async removeProduct(id: string) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("removeProduct error:", error);
      return;
    }

    emit();
  },

  /* SUBSCRIBE */
  subscribe(fn: () => void) {
    listeners.push(fn);
  },

  /* UNSUBSCRIBE */
  unsubscribe(fn: () => void) {
    listeners = listeners.filter((l) => l !== fn);
  },
};