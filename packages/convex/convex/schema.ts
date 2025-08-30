import { typedV } from "convex-helpers/validators";
import { defineSchema } from "convex/server";

import { authTables } from "./tables/authTables";
import { coffeeShopsTable } from "./tables/coffeeShop";
import { microlotsTable } from "./tables/microlot";
import { producersTable } from "./tables/producer";
import { purchasesTable } from "./tables/purchase";
import { tokenHoldingsTable } from "./tables/tokenHolding";
import { usersTable } from "./tables/user";

const schema = defineSchema({
  ...authTables,
  users: usersTable,
  producers: producersTable,
  coffeeShops: coffeeShopsTable,
  microlots: microlotsTable,
  tokenHoldings: tokenHoldingsTable,
  purchases: purchasesTable,
});

export default schema;
export const vv = typedV(schema);
