CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN');
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'FULFILLED');

CREATE TABLE "Tenant" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "User_tenant_id_unique" UNIQUE ("tenantId", "id"),
  CONSTRAINT "User_tenant_email_key" UNIQUE ("tenantId", "email"),
  CONSTRAINT "User_tenant_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE "Product" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "sku" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "priceMinor" BIGINT NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'INR',
  "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Product_tenant_id_unique" UNIQUE ("tenantId", "id"),
  CONSTRAINT "Product_tenant_sku_key" UNIQUE ("tenantId", "sku"),
  CONSTRAINT "Product_price_nonnegative" CHECK ("priceMinor" >= 0),
  CONSTRAINT "Product_currency_length" CHECK (char_length("currency") = 3),
  CONSTRAINT "Product_tenant_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE "Order" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "totalMinor" BIGINT NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'INR',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Order_tenant_id_unique" UNIQUE ("tenantId", "id"),
  CONSTRAINT "Order_total_nonnegative" CHECK ("totalMinor" >= 0),
  CONSTRAINT "Order_user_same_tenant_fkey" FOREIGN KEY ("tenantId", "userId") REFERENCES "User"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE "OrderItem" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unitPriceMinor" BIGINT NOT NULL,
  CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OrderItem_quantity_positive" CHECK ("quantity" > 0),
  CONSTRAINT "OrderItem_price_nonnegative" CHECK ("unitPriceMinor" >= 0),
  CONSTRAINT "OrderItem_order_same_tenant_fkey" FOREIGN KEY ("tenantId", "orderId") REFERENCES "Order"("tenantId", "id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "OrderItem_product_same_tenant_fkey" FOREIGN KEY ("tenantId", "productId") REFERENCES "Product"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "Product_tenant_status_createdAt_idx" ON "Product"("tenantId", "status", "createdAt");
CREATE INDEX "Order_tenant_createdAt_idx" ON "Order"("tenantId", "createdAt");
CREATE INDEX "Order_tenant_user_createdAt_idx" ON "Order"("tenantId", "userId", "createdAt");
