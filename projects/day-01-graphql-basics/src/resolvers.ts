import {
  findCustomerById,
  findOrderById,
  findOrdersByCustomerId,
  orders
} from "./data.js";

export const resolvers = {
  Query: {
    order: (_parent: unknown, args: { id: string }) => findOrderById(args.id),
    orders: () => orders,
    customer: (_parent: unknown, args: { id: string }) => findCustomerById(args.id)
  },
  Order: {
    customer: (parent: { customerId: string }) =>
      findCustomerById(parent.customerId)
  },
  Customer: {
    orders: (parent: { id: string }) => findOrdersByCustomerId(parent.id)
  }
};
