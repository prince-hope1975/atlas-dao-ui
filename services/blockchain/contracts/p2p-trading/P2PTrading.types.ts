/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.25.2.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export type Addr = string;
export type Timestamp = Uint64;
export type Uint64 = string;
export type AssetInfo = {
  sg721_token: Sg721Token;
} | {
  cw721_coin: Cw721Coin;
} | {
  coin: Coin;
};
export type Uint128 = string;
export type TradeState = "created" | "published" | "countered" | "refused" | "accepted" | "cancelled";
export interface AllCounterTradesResponse {
  counter_trades: TradeResponse[];
  [k: string]: unknown;
}
export interface TradeResponse {
  counter_id?: number | null;
  trade_id: number;
  trade_info?: TradeInfoResponse | null;
  [k: string]: unknown;
}
export interface TradeInfoResponse {
  accepted_info?: CounterTradeInfo | null;
  additional_info: AdditionalTradeInfoResponse;
  assets_withdrawn: boolean;
  associated_assets: AssetInfo[];
  last_counter_id?: number | null;
  owner: Addr;
  state: TradeState;
  whitelisted_users: Addr[];
  [k: string]: unknown;
}
export interface CounterTradeInfo {
  counter_id: number;
  trade_id: number;
  [k: string]: unknown;
}
export interface AdditionalTradeInfoResponse {
  nfts_wanted: Addr[];
  owner_comment?: Comment | null;
  time: Timestamp;
  tokens_wanted: AssetInfo[];
  trade_preview?: AssetInfo | null;
  trader_comment?: Comment | null;
  [k: string]: unknown;
}
export interface Comment {
  comment: string;
  time: Timestamp;
  [k: string]: unknown;
}
export interface Sg721Token {
  address: string;
  token_id: string;
  [k: string]: unknown;
}
export interface Cw721Coin {
  address: string;
  token_id: string;
  [k: string]: unknown;
}
export interface Coin {
  amount: Uint128;
  denom: string;
  [k: string]: unknown;
}
export interface AllTradesResponse {
  trades: TradeResponse[];
  [k: string]: unknown;
}
export type ExecuteMsg = {
  create_trade: {
    comment?: string | null;
    whitelisted_users?: string[] | null;
    [k: string]: unknown;
  };
} | {
  add_asset: {
    action: AddAssetAction;
    asset: AssetInfo;
    [k: string]: unknown;
  };
} | {
  remove_assets: {
    assets: [number, AssetInfo][];
    counter_id?: number | null;
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  add_whitelisted_users: {
    trade_id: number;
    whitelisted_users: string[];
    [k: string]: unknown;
  };
} | {
  remove_whitelisted_users: {
    trade_id: number;
    whitelisted_users: string[];
    [k: string]: unknown;
  };
} | {
  set_comment: {
    comment: string;
    counter_id?: number | null;
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  add_n_f_ts_wanted: {
    nfts_wanted: string[];
    trade_id?: number | null;
    [k: string]: unknown;
  };
} | {
  remove_n_f_ts_wanted: {
    nfts_wanted: string[];
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  set_n_f_ts_wanted: {
    nfts_wanted: string[];
    trade_id?: number | null;
    [k: string]: unknown;
  };
} | {
  flush_n_f_ts_wanted: {
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  add_tokens_wanted: {
    tokens_wanted: AssetInfo[];
    trade_id?: number | null;
    [k: string]: unknown;
  };
} | {
  remove_tokens_wanted: {
    tokens_wanted: AssetInfo[];
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  set_tokens_wanted: {
    tokens_wanted: AssetInfo[];
    trade_id?: number | null;
    [k: string]: unknown;
  };
} | {
  flush_tokens_wanted: {
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  set_trade_preview: {
    action: AddAssetAction;
    asset: AssetInfo;
    [k: string]: unknown;
  };
} | {
  confirm_trade: {
    trade_id?: number | null;
    [k: string]: unknown;
  };
} | {
  suggest_counter_trade: {
    comment?: string | null;
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  confirm_counter_trade: {
    counter_id?: number | null;
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  accept_trade: {
    comment?: string | null;
    counter_id: number;
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  cancel_trade: {
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  cancel_counter_trade: {
    counter_id: number;
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  refuse_counter_trade: {
    counter_id: number;
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  review_counter_trade: {
    comment?: string | null;
    counter_id: number;
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  withdraw_pending_assets: {
    trade_id: number;
    trader: string;
    [k: string]: unknown;
  };
} | {
  withdraw_all_from_trade: {
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  withdraw_all_from_counter: {
    counter_id: number;
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  set_new_owner: {
    owner: string;
    [k: string]: unknown;
  };
} | {
  set_new_fee_contract: {
    fee_contract: string;
    [k: string]: unknown;
  };
};
export type AddAssetAction = {
  to_last_trade: {
    [k: string]: unknown;
  };
} | {
  to_last_counter_trade: {
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  to_trade: {
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  to_counter_trade: {
    counter_id: number;
    trade_id: number;
    [k: string]: unknown;
  };
};
export interface InstantiateMsg {
  name: string;
  owner?: string | null;
  [k: string]: unknown;
}
export type QueryMsg = {
  contract_info: {
    [k: string]: unknown;
  };
} | {
  trade_info: {
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  counter_trade_info: {
    counter_id: number;
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  get_all_trades: {
    filters?: QueryFilters | null;
    limit?: number | null;
    start_after?: number | null;
    [k: string]: unknown;
  };
} | {
  get_counter_trades: {
    filters?: QueryFilters | null;
    limit?: number | null;
    start_after?: number | null;
    trade_id: number;
    [k: string]: unknown;
  };
} | {
  get_all_counter_trades: {
    filters?: QueryFilters | null;
    limit?: number | null;
    start_after?: CounterTradeInfo | null;
    [k: string]: unknown;
  };
};
export interface QueryFilters {
  assets_withdrawn?: boolean | null;
  contains_token?: string | null;
  counterer?: string | null;
  has_whitelist?: boolean | null;
  owner?: string | null;
  states?: string[] | null;
  wanted_nft?: string | null;
  whitelisted_user?: string | null;
  [k: string]: unknown;
}