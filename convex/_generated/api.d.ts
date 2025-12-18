/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as images_create from "../images/create.js";
import type * as images_store from "../images/store.js";
import type * as organizations_create from "../organizations/create.js";
import type * as organizations_get from "../organizations/get.js";
import type * as organizations_updateClerk from "../organizations/updateClerk.js";
import type * as properties_create from "../properties/create.js";
import type * as properties_createInternal from "../properties/createInternal.js";
import type * as properties_scrape from "../properties/scrape.js";
import type * as properties_updateInternal from "../properties/updateInternal.js";
import type * as users_create from "../users/create.js";
import type * as users_list from "../users/list.js";
import type * as users_update from "../users/update.js";
import type * as users_updateClerk from "../users/updateClerk.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "images/create": typeof images_create;
  "images/store": typeof images_store;
  "organizations/create": typeof organizations_create;
  "organizations/get": typeof organizations_get;
  "organizations/updateClerk": typeof organizations_updateClerk;
  "properties/create": typeof properties_create;
  "properties/createInternal": typeof properties_createInternal;
  "properties/scrape": typeof properties_scrape;
  "properties/updateInternal": typeof properties_updateInternal;
  "users/create": typeof users_create;
  "users/list": typeof users_list;
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
