export interface MenuItem {
  id?: string | undefined;
  category: string;
  name: string;
  options?: string[] | string;
  price: number;
  cost: number;
  stock: number;
}
