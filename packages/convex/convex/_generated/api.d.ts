/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as authAdapter from "../authAdapter.js";
import type * as http from "../http.js";
import type * as tables_authTables from "../tables/authTables.js";
import type * as tables_coffeeShop from "../tables/coffeeShop.js";
import type * as tables_microlot from "../tables/microlot.js";
import type * as tables_producer from "../tables/producer.js";
import type * as tables_purchase from "../tables/purchase.js";
import type * as tables_tokenHolding from "../tables/tokenHolding.js";
import type * as tables_user from "../tables/user.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  authAdapter: typeof authAdapter;
  http: typeof http;
  "tables/authTables": typeof tables_authTables;
  "tables/coffeeShop": typeof tables_coffeeShop;
  "tables/microlot": typeof tables_microlot;
  "tables/producer": typeof tables_producer;
  "tables/purchase": typeof tables_purchase;
  "tables/tokenHolding": typeof tables_tokenHolding;
  "tables/user": typeof tables_user;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
