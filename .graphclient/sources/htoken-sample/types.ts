// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace HtokenSampleTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
};

export type Collateral_orderBy =
  | 'id'
  | 'collateralID'
  | 'underlyingTokenAddr'
  | 'collateralTokenAddr'
  | 'hTokenAddr'
  | 'activeCoupon'
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

  export type QuerySdk = {
      /** null **/
  coupon: InContextSdkMethod<Query['coupon'], QuerycouponArgs, MeshContext>,
  /** null **/
  coupons: InContextSdkMethod<Query['coupons'], QuerycouponsArgs, MeshContext>,
  /** null **/
  collateral: InContextSdkMethod<Query['collateral'], QuerycollateralArgs, MeshContext>,
  /** null **/
  collaterals: InContextSdkMethod<Query['collaterals'], QuerycollateralsArgs, MeshContext>,
  /** null **/
  userUnderlying: InContextSdkMethod<Query['userUnderlying'], QueryuserUnderlyingArgs, MeshContext>,
  /** null **/
  userUnderlyings: InContextSdkMethod<Query['userUnderlyings'], QueryuserUnderlyingsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  coupon: InContextSdkMethod<Subscription['coupon'], SubscriptioncouponArgs, MeshContext>,
  /** null **/
  coupons: InContextSdkMethod<Subscription['coupons'], SubscriptioncouponsArgs, MeshContext>,
  /** null **/
  collateral: InContextSdkMethod<Subscription['collateral'], SubscriptioncollateralArgs, MeshContext>,
  /** null **/
  collaterals: InContextSdkMethod<Subscription['collaterals'], SubscriptioncollateralsArgs, MeshContext>,
  /** null **/
  userUnderlying: InContextSdkMethod<Subscription['userUnderlying'], SubscriptionuserUnderlyingArgs, MeshContext>,
  /** null **/
  userUnderlyings: InContextSdkMethod<Subscription['userUnderlyings'], SubscriptionuserUnderlyingsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["htoken-sample"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
