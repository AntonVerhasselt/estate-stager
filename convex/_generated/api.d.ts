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
import type * as images_delete from "../images/delete.js";
import type * as images_filter from "../images/filter.js";
import type * as images_store from "../images/store.js";
import type * as lib_clerk from "../lib/clerk.js";
import type * as organizations_create from "../organizations/create.js";
import type * as organizations_get from "../organizations/get.js";
import type * as organizations_updateClerk from "../organizations/updateClerk.js";
import type * as properties_create from "../properties/create.js";
import type * as properties_createInternal from "../properties/createInternal.js";
import type * as properties_get from "../properties/get.js";
import type * as properties_list from "../properties/list.js";
import type * as properties_scrape from "../properties/scrape.js";
import type * as properties_update from "../properties/update.js";
import type * as properties_updateInternal from "../properties/updateInternal.js";
import type * as users_create from "../users/create.js";
import type * as users_list from "../users/list.js";
import type * as users_update from "../users/update.js";
import type * as users_updateClerk from "../users/updateClerk.js";
import type * as visits_create from "../visits/create.js";
import type * as visits_get from "../visits/get.js";
import type * as visits_update from "../visits/update.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "images/create": typeof images_create;
  "images/delete": typeof images_delete;
  "images/filter": typeof images_filter;
  "images/store": typeof images_store;
  "lib/clerk": typeof lib_clerk;
  "organizations/create": typeof organizations_create;
  "organizations/get": typeof organizations_get;
  "organizations/updateClerk": typeof organizations_updateClerk;
  "properties/create": typeof properties_create;
  "properties/createInternal": typeof properties_createInternal;
  "properties/get": typeof properties_get;
  "properties/list": typeof properties_list;
  "properties/scrape": typeof properties_scrape;
  "properties/update": typeof properties_update;
  "properties/updateInternal": typeof properties_updateInternal;
  "users/create": typeof users_create;
  "users/list": typeof users_list;
  "users/update": typeof users_update;
  "users/updateClerk": typeof users_updateClerk;
  "visits/create": typeof visits_create;
  "visits/get": typeof visits_get;
  "visits/update": typeof visits_update;
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
