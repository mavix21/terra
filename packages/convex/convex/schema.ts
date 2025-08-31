import { typedV } from "convex-helpers/validators";
import { defineSchema } from "convex/server";

import { authTables } from "./tables/authTables";
import { buyerVerificationTable } from "./tables/buyerVerification";
import { coffeeShopsTable } from "./tables/coffeeShop";
import { microlotsTable } from "./tables/microlot";
import { producersTable } from "./tables/producer";
import { purchasesTable } from "./tables/purchase";
import { tokenHoldingsTable } from "./tables/tokenHolding";

const schema = defineSchema({
  ...authTables,
  producers: producersTable,
  coffeeShops: coffeeShopsTable,
  microlots: microlotsTable,
  tokenHoldings: tokenHoldingsTable,
  purchases: purchasesTable,
  buyerVerifications: buyerVerificationTable,
});

export default schema;
export const vv = typedV(schema);
