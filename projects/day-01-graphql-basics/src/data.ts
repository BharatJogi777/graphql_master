export interface Customer {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "CANCELLED";
  totalAmount: number;
  customerId: string;
}

export const customers: Customer[] = [
  { id: "cus-1", name: "Asha Rao" },
  { id: "cus-2", name: "Rahul Nair" }
];

export const orders: Order[] = [
  { id: "ord-101", status: "CONFIRMED", totalAmount: 1499.5, customerId: "cus-1" },
  { id: "ord-102", status: "PENDING", totalAmount: 799, customerId: "cus-1" },
  { id: "ord-103", status: "SHIPPED", totalAmount: 2499, customerId: "cus-2" }
];

export function findOrderById(id: string): Order | null {
  return orders.find((order) => order.id === id) ?? null;
}

export function findCustomerById(id: string): Customer | null {
  return customers.find((customer) => customer.id === id) ?? null;
}

export function findOrdersByCustomerId(customerId: string): Order[] {
  return orders.filter((order) => order.customerId === customerId);
}
