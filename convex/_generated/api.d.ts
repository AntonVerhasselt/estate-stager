/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as organizations_create from "../organizations/create.js";
import type * as organizations_updateClerk from "../organizations/updateClerk.js";
import type * as users_create from "../users/create.js";
import type * as users_update from "../users/update.js";
import type * as users_updateClerk from "../users/updateClerk.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "organizations/create": typeof organizations_create;
  "organizations/updateClerk": typeof organizations_updateClerk;
  "users/create": typeof users_create;
  "users/update": typeof users_update;
  "users/updateClerk": typeof users_updateClerk;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
