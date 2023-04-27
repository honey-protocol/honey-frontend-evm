// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@graphql-mesh/utils';

import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from "@graphql-mesh/graphql"
import BareMerger from "@graphql-mesh/merger-bare";
import { printWithCache } from '@graphql-mesh/utils';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { HoneyDashboardPolygonTypes } from './sources/honey-dashboard-polygon/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Collateral = {
  id: Scalars['ID'];
  collateralID: Scalars['BigInt'];
  underlyingTokenAddr: Scalars['String'];
  collateralTokenAddr: Scalars['String'];
  hTokenAddr: Scalars['String'];
  activeCoupon: Coupon;
  active: Scalars['Boolean'];
};

export type Collateral_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  collateralID?: InputMaybe<Scalars['BigInt']>;
  collateralID_not?: InputMaybe<Scalars['BigInt']>;
  collateralID_gt?: InputMaybe<Scalars['BigInt']>;
  collateralID_lt?: InputMaybe<Scalars['BigInt']>;
  collateralID_gte?: InputMaybe<Scalars['BigInt']>;
  collateralID_lte?: InputMaybe<Scalars['BigInt']>;
  collateralID_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateralID_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  underlyingTokenAddr?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_not?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_gt?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_lt?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_gte?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_lte?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_in?: InputMaybe<Array<Scalars['String']>>;
  underlyingTokenAddr_not_in?: InputMaybe<Array<Scalars['String']>>;
  underlyingTokenAddr_contains?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_contains_nocase?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_not_contains?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_not_contains_nocase?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_starts_with?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_starts_with_nocase?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_not_starts_with?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_ends_with?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_ends_with_nocase?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_not_ends_with?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  collateralTokenAddr?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_not?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_gt?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_lt?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_gte?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_lte?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_in?: InputMaybe<Array<Scalars['String']>>;
  collateralTokenAddr_not_in?: InputMaybe<Array<Scalars['String']>>;
  collateralTokenAddr_contains?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_contains_nocase?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_not_contains?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_not_contains_nocase?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_starts_with?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_starts_with_nocase?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_not_starts_with?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_ends_with?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_ends_with_nocase?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_not_ends_with?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr?: InputMaybe<Scalars['String']>;
  hTokenAddr_not?: InputMaybe<Scalars['String']>;
  hTokenAddr_gt?: InputMaybe<Scalars['String']>;
  hTokenAddr_lt?: InputMaybe<Scalars['String']>;
  hTokenAddr_gte?: InputMaybe<Scalars['String']>;
  hTokenAddr_lte?: InputMaybe<Scalars['String']>;
  hTokenAddr_in?: InputMaybe<Array<Scalars['String']>>;
  hTokenAddr_not_in?: InputMaybe<Array<Scalars['String']>>;
  hTokenAddr_contains?: InputMaybe<Scalars['String']>;
  hTokenAddr_contains_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_contains?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr_starts_with?: InputMaybe<Scalars['String']>;
  hTokenAddr_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_starts_with?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr_ends_with?: InputMaybe<Scalars['String']>;
  hTokenAddr_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_ends_with?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  activeCoupon?: InputMaybe<Scalars['String']>;
  activeCoupon_not?: InputMaybe<Scalars['String']>;
  activeCoupon_gt?: InputMaybe<Scalars['String']>;
  activeCoupon_lt?: InputMaybe<Scalars['String']>;
  activeCoupon_gte?: InputMaybe<Scalars['String']>;
  activeCoupon_lte?: InputMaybe<Scalars['String']>;
  activeCoupon_in?: InputMaybe<Array<Scalars['String']>>;
  activeCoupon_not_in?: InputMaybe<Array<Scalars['String']>>;
  activeCoupon_contains?: InputMaybe<Scalars['String']>;
  activeCoupon_contains_nocase?: InputMaybe<Scalars['String']>;
  activeCoupon_not_contains?: InputMaybe<Scalars['String']>;
  activeCoupon_not_contains_nocase?: InputMaybe<Scalars['String']>;
  activeCoupon_starts_with?: InputMaybe<Scalars['String']>;
  activeCoupon_starts_with_nocase?: InputMaybe<Scalars['String']>;
  activeCoupon_not_starts_with?: InputMaybe<Scalars['String']>;
  activeCoupon_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  activeCoupon_ends_with?: InputMaybe<Scalars['String']>;
  activeCoupon_ends_with_nocase?: InputMaybe<Scalars['String']>;
  activeCoupon_not_ends_with?: InputMaybe<Scalars['String']>;
  activeCoupon_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  activeCoupon_?: InputMaybe<Coupon_filter>;
  active?: InputMaybe<Scalars['Boolean']>;
  active_not?: InputMaybe<Scalars['Boolean']>;
  active_in?: InputMaybe<Array<Scalars['Boolean']>>;
  active_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Collateral_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Collateral_filter>>>;
};

export type Collateral_orderBy =
  | 'id'
  | 'collateralID'
  | 'underlyingTokenAddr'
  | 'collateralTokenAddr'
  | 'hTokenAddr'
  | 'activeCoupon'
  | 'activeCoupon__id'
  | 'activeCoupon__collateralID'
  | 'activeCoupon__couponID'
  | 'activeCoupon__underlyingTokenAddr'
  | 'activeCoupon__collateralTokenAddr'
  | 'activeCoupon__hTokenAddr'
  | 'activeCoupon__active'
  | 'activeCoupon__owner'
  | 'activeCoupon__amount'
  | 'activeCoupon__timestamp'
  | 'activeCoupon__lastUpdateTimestamp'
  | 'active';

export type Coupon = {
  id: Scalars['ID'];
  collateralID: Scalars['BigInt'];
  couponID: Scalars['BigInt'];
  underlyingTokenAddr: Scalars['String'];
  collateralTokenAddr: Scalars['String'];
  hTokenAddr: Scalars['String'];
  active: Scalars['Boolean'];
  owner: Scalars['String'];
  amount: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  lastUpdateTimestamp: Scalars['BigInt'];
};

export type Coupon_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  collateralID?: InputMaybe<Scalars['BigInt']>;
  collateralID_not?: InputMaybe<Scalars['BigInt']>;
  collateralID_gt?: InputMaybe<Scalars['BigInt']>;
  collateralID_lt?: InputMaybe<Scalars['BigInt']>;
  collateralID_gte?: InputMaybe<Scalars['BigInt']>;
  collateralID_lte?: InputMaybe<Scalars['BigInt']>;
  collateralID_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateralID_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  couponID?: InputMaybe<Scalars['BigInt']>;
  couponID_not?: InputMaybe<Scalars['BigInt']>;
  couponID_gt?: InputMaybe<Scalars['BigInt']>;
  couponID_lt?: InputMaybe<Scalars['BigInt']>;
  couponID_gte?: InputMaybe<Scalars['BigInt']>;
  couponID_lte?: InputMaybe<Scalars['BigInt']>;
  couponID_in?: InputMaybe<Array<Scalars['BigInt']>>;
  couponID_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  underlyingTokenAddr?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_not?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_gt?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_lt?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_gte?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_lte?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_in?: InputMaybe<Array<Scalars['String']>>;
  underlyingTokenAddr_not_in?: InputMaybe<Array<Scalars['String']>>;
  underlyingTokenAddr_contains?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_contains_nocase?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_not_contains?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_not_contains_nocase?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_starts_with?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_starts_with_nocase?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_not_starts_with?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_ends_with?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_ends_with_nocase?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_not_ends_with?: InputMaybe<Scalars['String']>;
  underlyingTokenAddr_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  collateralTokenAddr?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_not?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_gt?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_lt?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_gte?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_lte?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_in?: InputMaybe<Array<Scalars['String']>>;
  collateralTokenAddr_not_in?: InputMaybe<Array<Scalars['String']>>;
  collateralTokenAddr_contains?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_contains_nocase?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_not_contains?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_not_contains_nocase?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_starts_with?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_starts_with_nocase?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_not_starts_with?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_ends_with?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_ends_with_nocase?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_not_ends_with?: InputMaybe<Scalars['String']>;
  collateralTokenAddr_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr?: InputMaybe<Scalars['String']>;
  hTokenAddr_not?: InputMaybe<Scalars['String']>;
  hTokenAddr_gt?: InputMaybe<Scalars['String']>;
  hTokenAddr_lt?: InputMaybe<Scalars['String']>;
  hTokenAddr_gte?: InputMaybe<Scalars['String']>;
  hTokenAddr_lte?: InputMaybe<Scalars['String']>;
  hTokenAddr_in?: InputMaybe<Array<Scalars['String']>>;
  hTokenAddr_not_in?: InputMaybe<Array<Scalars['String']>>;
  hTokenAddr_contains?: InputMaybe<Scalars['String']>;
  hTokenAddr_contains_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_contains?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr_starts_with?: InputMaybe<Scalars['String']>;
  hTokenAddr_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_starts_with?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr_ends_with?: InputMaybe<Scalars['String']>;
  hTokenAddr_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_ends_with?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  active?: InputMaybe<Scalars['Boolean']>;
  active_not?: InputMaybe<Scalars['Boolean']>;
  active_in?: InputMaybe<Array<Scalars['Boolean']>>;
  active_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  owner?: InputMaybe<Scalars['String']>;
  owner_not?: InputMaybe<Scalars['String']>;
  owner_gt?: InputMaybe<Scalars['String']>;
  owner_lt?: InputMaybe<Scalars['String']>;
  owner_gte?: InputMaybe<Scalars['String']>;
  owner_lte?: InputMaybe<Scalars['String']>;
  owner_in?: InputMaybe<Array<Scalars['String']>>;
  owner_not_in?: InputMaybe<Array<Scalars['String']>>;
  owner_contains?: InputMaybe<Scalars['String']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_not_contains?: InputMaybe<Scalars['String']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_starts_with?: InputMaybe<Scalars['String']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner_not_starts_with?: InputMaybe<Scalars['String']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner_ends_with?: InputMaybe<Scalars['String']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Coupon_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Coupon_filter>>>;
};

export type Coupon_orderBy =
  | 'id'
  | 'collateralID'
  | 'couponID'
  | 'underlyingTokenAddr'
  | 'collateralTokenAddr'
  | 'hTokenAddr'
  | 'active'
  | 'owner'
  | 'amount'
  | 'timestamp'
  | 'lastUpdateTimestamp';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Query = {
  coupon?: Maybe<Coupon>;
  coupons: Array<Coupon>;
  collateral?: Maybe<Collateral>;
  collaterals: Array<Collateral>;
  userUnderlying?: Maybe<UserUnderlying>;
  userUnderlyings: Array<UserUnderlying>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QuerycouponArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycouponsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Coupon_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Coupon_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycollateralArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycollateralsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Collateral_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Collateral_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryuserUnderlyingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryuserUnderlyingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserUnderlying_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UserUnderlying_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  coupon?: Maybe<Coupon>;
  coupons: Array<Coupon>;
  collateral?: Maybe<Collateral>;
  collaterals: Array<Collateral>;
  userUnderlying?: Maybe<UserUnderlying>;
  userUnderlyings: Array<UserUnderlying>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptioncouponArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncouponsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Coupon_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Coupon_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncollateralArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncollateralsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Collateral_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Collateral_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionuserUnderlyingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionuserUnderlyingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserUnderlying_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UserUnderlying_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type UserUnderlying = {
  id: Scalars['ID'];
  hTokenAddr: Scalars['String'];
  owner: Scalars['String'];
  amount: Scalars['BigInt'];
};

export type UserUnderlying_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  hTokenAddr?: InputMaybe<Scalars['String']>;
  hTokenAddr_not?: InputMaybe<Scalars['String']>;
  hTokenAddr_gt?: InputMaybe<Scalars['String']>;
  hTokenAddr_lt?: InputMaybe<Scalars['String']>;
  hTokenAddr_gte?: InputMaybe<Scalars['String']>;
  hTokenAddr_lte?: InputMaybe<Scalars['String']>;
  hTokenAddr_in?: InputMaybe<Array<Scalars['String']>>;
  hTokenAddr_not_in?: InputMaybe<Array<Scalars['String']>>;
  hTokenAddr_contains?: InputMaybe<Scalars['String']>;
  hTokenAddr_contains_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_contains?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr_starts_with?: InputMaybe<Scalars['String']>;
  hTokenAddr_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_starts_with?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr_ends_with?: InputMaybe<Scalars['String']>;
  hTokenAddr_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_ends_with?: InputMaybe<Scalars['String']>;
  hTokenAddr_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['String']>;
  owner_not?: InputMaybe<Scalars['String']>;
  owner_gt?: InputMaybe<Scalars['String']>;
  owner_lt?: InputMaybe<Scalars['String']>;
  owner_gte?: InputMaybe<Scalars['String']>;
  owner_lte?: InputMaybe<Scalars['String']>;
  owner_in?: InputMaybe<Array<Scalars['String']>>;
  owner_not_in?: InputMaybe<Array<Scalars['String']>>;
  owner_contains?: InputMaybe<Scalars['String']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_not_contains?: InputMaybe<Scalars['String']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_starts_with?: InputMaybe<Scalars['String']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner_not_starts_with?: InputMaybe<Scalars['String']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner_ends_with?: InputMaybe<Scalars['String']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UserUnderlying_filter>>>;
  or?: InputMaybe<Array<InputMaybe<UserUnderlying_filter>>>;
};

export type UserUnderlying_orderBy =
  | 'id'
  | 'hTokenAddr'
  | 'owner'
  | 'amount';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  Collateral: ResolverTypeWrapper<Collateral>;
  Collateral_filter: Collateral_filter;
  Collateral_orderBy: Collateral_orderBy;
  Coupon: ResolverTypeWrapper<Coupon>;
  Coupon_filter: Coupon_filter;
  Coupon_orderBy: Coupon_orderBy;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  OrderDirection: OrderDirection;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  UserUnderlying: ResolverTypeWrapper<UserUnderlying>;
  UserUnderlying_filter: UserUnderlying_filter;
  UserUnderlying_orderBy: UserUnderlying_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean'];
  Bytes: Scalars['Bytes'];
  Collateral: Collateral;
  Collateral_filter: Collateral_filter;
  Coupon: Coupon;
  Coupon_filter: Coupon_filter;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Query: {};
  String: Scalars['String'];
  Subscription: {};
  UserUnderlying: UserUnderlying;
  UserUnderlying_filter: UserUnderlying_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String'];
};

export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type CollateralResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Collateral'] = ResolversParentTypes['Collateral']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  collateralID?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  underlyingTokenAddr?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  collateralTokenAddr?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hTokenAddr?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  activeCoupon?: Resolver<ResolversTypes['Coupon'], ParentType, ContextType>;
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CouponResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Coupon'] = ResolversParentTypes['Coupon']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  collateralID?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  couponID?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  underlyingTokenAddr?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  collateralTokenAddr?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hTokenAddr?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  lastUpdateTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  coupon?: Resolver<Maybe<ResolversTypes['Coupon']>, ParentType, ContextType, RequireFields<QuerycouponArgs, 'id' | 'subgraphError'>>;
  coupons?: Resolver<Array<ResolversTypes['Coupon']>, ParentType, ContextType, RequireFields<QuerycouponsArgs, 'skip' | 'first' | 'subgraphError'>>;
  collateral?: Resolver<Maybe<ResolversTypes['Collateral']>, ParentType, ContextType, RequireFields<QuerycollateralArgs, 'id' | 'subgraphError'>>;
  collaterals?: Resolver<Array<ResolversTypes['Collateral']>, ParentType, ContextType, RequireFields<QuerycollateralsArgs, 'skip' | 'first' | 'subgraphError'>>;
  userUnderlying?: Resolver<Maybe<ResolversTypes['UserUnderlying']>, ParentType, ContextType, RequireFields<QueryuserUnderlyingArgs, 'id' | 'subgraphError'>>;
  userUnderlyings?: Resolver<Array<ResolversTypes['UserUnderlying']>, ParentType, ContextType, RequireFields<QueryuserUnderlyingsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  coupon?: SubscriptionResolver<Maybe<ResolversTypes['Coupon']>, "coupon", ParentType, ContextType, RequireFields<SubscriptioncouponArgs, 'id' | 'subgraphError'>>;
  coupons?: SubscriptionResolver<Array<ResolversTypes['Coupon']>, "coupons", ParentType, ContextType, RequireFields<SubscriptioncouponsArgs, 'skip' | 'first' | 'subgraphError'>>;
  collateral?: SubscriptionResolver<Maybe<ResolversTypes['Collateral']>, "collateral", ParentType, ContextType, RequireFields<SubscriptioncollateralArgs, 'id' | 'subgraphError'>>;
  collaterals?: SubscriptionResolver<Array<ResolversTypes['Collateral']>, "collaterals", ParentType, ContextType, RequireFields<SubscriptioncollateralsArgs, 'skip' | 'first' | 'subgraphError'>>;
  userUnderlying?: SubscriptionResolver<Maybe<ResolversTypes['UserUnderlying']>, "userUnderlying", ParentType, ContextType, RequireFields<SubscriptionuserUnderlyingArgs, 'id' | 'subgraphError'>>;
  userUnderlyings?: SubscriptionResolver<Array<ResolversTypes['UserUnderlying']>, "userUnderlyings", ParentType, ContextType, RequireFields<SubscriptionuserUnderlyingsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;

export type UserUnderlyingResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['UserUnderlying'] = ResolversParentTypes['UserUnderlying']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  hTokenAddr?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  Collateral?: CollateralResolvers<ContextType>;
  Coupon?: CouponResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  UserUnderlying?: UserUnderlyingResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = HoneyDashboardPolygonTypes.Context & BaseMeshContext;


import { fileURLToPath } from '@graphql-mesh/utils';
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclient/sources/honey-dashboard-polygon/introspectionSchema":
      return import("./sources/honey-dashboard-polygon/introspectionSchema") as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("GraphClient");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const honeyDashboardPolygonTransforms = [];
const additionalTypeDefs = [] as any[];
const honeyDashboardPolygonHandler = new GraphqlHandler({
              name: "honey-dashboard-polygon",
              config: {"endpoint":"https://api.thegraph.com/subgraphs/name/tomjpandolfi/honey-dashboard-polygon"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("honey-dashboard-polygon"),
              logger: logger.child("honey-dashboard-polygon"),
              importFn,
            });
sources[0] = {
          name: 'honey-dashboard-polygon',
          handler: honeyDashboardPolygonHandler,
          transforms: honeyDashboardPolygonTransforms
        }
const additionalResolvers = [] as any[]
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      {
        document: ActiveCouponQueryDocument,
        get rawSDL() {
          return printWithCache(ActiveCouponQueryDocument);
        },
        location: 'ActiveCouponQueryDocument.graphql'
      },{
        document: ActiveCouponByCollectionQueryDocument,
        get rawSDL() {
          return printWithCache(ActiveCouponByCollectionQueryDocument);
        },
        location: 'ActiveCouponByCollectionQueryDocument.graphql'
      },{
        document: ActiveCouponByUserQueryDocument,
        get rawSDL() {
          return printWithCache(ActiveCouponByUserQueryDocument);
        },
        location: 'ActiveCouponByUserQueryDocument.graphql'
      },{
        document: UnderlyingByUserQueryDocument,
        get rawSDL() {
          return printWithCache(UnderlyingByUserQueryDocument);
        },
        location: 'UnderlyingByUserQueryDocument.graphql'
      }
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
  return getSdk<TOperationContext, TGlobalContext>((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
export type CouponDataFragment = Pick<Coupon, 'collateralID' | 'couponID' | 'underlyingTokenAddr' | 'collateralTokenAddr' | 'hTokenAddr' | 'owner' | 'amount'>;

export type UserUnderlyingDataFragment = Pick<UserUnderlying, 'owner' | 'amount' | 'hTokenAddr'>;

export type ActiveCouponQueryQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
}>;


export type ActiveCouponQueryQuery = { coupons: Array<Pick<Coupon, 'collateralID' | 'couponID' | 'underlyingTokenAddr' | 'collateralTokenAddr' | 'hTokenAddr' | 'owner' | 'amount'>> };

export type ActiveCouponByCollectionQueryQueryVariables = Exact<{
  HERC20ContractAddress: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
}>;


export type ActiveCouponByCollectionQueryQuery = { coupons: Array<Pick<Coupon, 'collateralID' | 'couponID' | 'underlyingTokenAddr' | 'collateralTokenAddr' | 'hTokenAddr' | 'owner' | 'amount'>> };

export type ActiveCouponByUserQueryQueryVariables = Exact<{
  userAddress: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
}>;


export type ActiveCouponByUserQueryQuery = { coupons: Array<Pick<Coupon, 'collateralID' | 'couponID' | 'underlyingTokenAddr' | 'collateralTokenAddr' | 'hTokenAddr' | 'owner' | 'amount'>> };

export type UnderlyingByUserQueryQueryVariables = Exact<{
  userAddress: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
}>;


export type UnderlyingByUserQueryQuery = { userUnderlyings: Array<Pick<UserUnderlying, 'owner' | 'amount' | 'hTokenAddr'>> };

export const CouponDataFragmentDoc = gql`
    fragment CouponData on Coupon {
  collateralID
  couponID
  underlyingTokenAddr
  collateralTokenAddr
  hTokenAddr
  owner
  amount
}
    ` as unknown as DocumentNode<CouponDataFragment, unknown>;
export const UserUnderlyingDataFragmentDoc = gql`
    fragment UserUnderlyingData on UserUnderlying {
  owner
  amount
  hTokenAddr
}
    ` as unknown as DocumentNode<UserUnderlyingDataFragment, unknown>;
export const ActiveCouponQueryDocument = gql`
    query ActiveCouponQuery($first: Int = 100) {
  coupons(
    first: $first
    orderBy: underlyingTokenAddr
    orderDirection: desc
    where: {active: true}
  ) {
    ...CouponData
  }
}
    ${CouponDataFragmentDoc}` as unknown as DocumentNode<ActiveCouponQueryQuery, ActiveCouponQueryQueryVariables>;
export const ActiveCouponByCollectionQueryDocument = gql`
    query ActiveCouponByCollectionQuery($HERC20ContractAddress: String!, $first: Int = 100) {
  coupons(
    first: $first
    orderBy: underlyingTokenAddr
    orderDirection: desc
    where: {active: true, hTokenAddr: $HERC20ContractAddress}
  ) {
    ...CouponData
  }
}
    ${CouponDataFragmentDoc}` as unknown as DocumentNode<ActiveCouponByCollectionQueryQuery, ActiveCouponByCollectionQueryQueryVariables>;
export const ActiveCouponByUserQueryDocument = gql`
    query ActiveCouponByUserQuery($userAddress: String!, $first: Int = 100) {
  coupons(
    first: $first
    orderBy: underlyingTokenAddr
    orderDirection: desc
    where: {active: true, owner: $userAddress}
  ) {
    ...CouponData
  }
}
    ${CouponDataFragmentDoc}` as unknown as DocumentNode<ActiveCouponByUserQueryQuery, ActiveCouponByUserQueryQueryVariables>;
export const UnderlyingByUserQueryDocument = gql`
    query UnderlyingByUserQuery($userAddress: String!, $first: Int = 100) {
  userUnderlyings(
    first: $first
    orderBy: hTokenAddr
    orderDirection: desc
    where: {owner: $userAddress}
  ) {
    ...UserUnderlyingData
  }
}
    ${UserUnderlyingDataFragmentDoc}` as unknown as DocumentNode<UnderlyingByUserQueryQuery, UnderlyingByUserQueryQueryVariables>;





export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    ActiveCouponQuery(variables?: ActiveCouponQueryQueryVariables, options?: C): Promise<ActiveCouponQueryQuery> {
      return requester<ActiveCouponQueryQuery, ActiveCouponQueryQueryVariables>(ActiveCouponQueryDocument, variables, options) as Promise<ActiveCouponQueryQuery>;
    },
    ActiveCouponByCollectionQuery(variables: ActiveCouponByCollectionQueryQueryVariables, options?: C): Promise<ActiveCouponByCollectionQueryQuery> {
      return requester<ActiveCouponByCollectionQueryQuery, ActiveCouponByCollectionQueryQueryVariables>(ActiveCouponByCollectionQueryDocument, variables, options) as Promise<ActiveCouponByCollectionQueryQuery>;
    },
    ActiveCouponByUserQuery(variables: ActiveCouponByUserQueryQueryVariables, options?: C): Promise<ActiveCouponByUserQueryQuery> {
      return requester<ActiveCouponByUserQueryQuery, ActiveCouponByUserQueryQueryVariables>(ActiveCouponByUserQueryDocument, variables, options) as Promise<ActiveCouponByUserQueryQuery>;
    },
    UnderlyingByUserQuery(variables: UnderlyingByUserQueryQueryVariables, options?: C): Promise<UnderlyingByUserQueryQuery> {
      return requester<UnderlyingByUserQueryQuery, UnderlyingByUserQueryQueryVariables>(UnderlyingByUserQueryDocument, variables, options) as Promise<UnderlyingByUserQueryQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;