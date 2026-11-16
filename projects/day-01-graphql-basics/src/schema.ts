import { gql } from "graphql-tag";

// The schema is the public contract clients can query.
// Keep it independent from the storage implementation.
export const typeDefs = gql`
  enum OrderStatus {
    PENDING
    CONFIRMED
    SHIPPED
    CANCELLED
  }

  type Customer {
    id: ID!
    name: String!
    orders: [Order!]!
  }

  type Order {
    id: ID!
    status: OrderStatus!
    totalAmount: Float!
    customer: Customer!
  }

  type Query {
    order(id: ID!): Order
    orders: [Order!]!
    customer(id: ID!): Customer
  }
`;
