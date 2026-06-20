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

function emit() {
listeners.forEach((fn) => fn());
}

export const productStore = {
async getAll(): Promise<Product[]> {
const { data, error } = await supabase
.from("products")
.select("*")
.order("id", { ascending: false });

if (error) {
  console.error(error);
  return [];
}

return data as Product[];
},

async getById(id: string): Promise<Product | null> {
const { data, error } = await supabase
.from("products")
.select("*")
.eq("id", id)
.single();

if (error) {
  console.error(error);
  return null;
}

return data as Product;
},

async addProduct(product: Product) {
const { error } = await supabase
.from("products")
.insert(product);

if (error) {
  console.error(error);
  return;
}

emit();
},

async removeProduct(id: string) {
const { error } = await supabase
.from("products")
.delete()
.eq("id", id);

if (error) {
  console.error(error);
  return;
}

emit();

},

subscribe(fn: () => void) {
listeners.push(fn);
},

unsubscribe(fn: () => void) {
listeners = listeners.filter((l) => l !== fn);
},
};
