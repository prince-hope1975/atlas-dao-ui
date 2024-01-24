import { gql } from "@apollo/client";
export interface ApiResponse {
  tokens: TokenNode;
  collections: CollectionNode;
}

interface TokenNode {
  __typename: string;
  total: number;
  tokens: Token[];
}

export interface Token {
  __typename: string;
  collectionAddr: string;
  name: string;
  price: number | null;
  priceExpiresAt: string | null;
  saleType: string | null;
  tokenId: string;
  highestCollectionBid: number | null;
  description: string;
  forSale: boolean;
  imageUrl: string;
  rarityOrder: number | null;
  traits: TokenTrait[];
  id: string;
  lastSale: number | null;
  highestCollectionBidEvent: number | null;
}

interface TokenTrait {
  __typename: string;
  name: string;
  value: string;
  rarityPercent: number;
}

interface CollectionNode {
  __typename: string;
  collections: Collection[];
}

export interface Collection {
  __typename: string;
  name: string;
  description?:string
  mintedAt: string;
  createdByAddr: string;
  collectionAddr: string;
}


export const WALLET_DATA = gql`
  query Tokens($ownerAddr: String, $sortBy: TokenSortBy, $limit: Int) {
    tokens(ownerAddr: $ownerAddr, sortBy: $sortBy, limit: $limit) {
      total
      tokens {
        collectionAddr
        name
        price {
          denom
          amount
        }
        priceExpiresAt
        saleType
        tokenId
        highestCollectionBid
        description
        forSale
        imageUrl
        rarityOrder
        traits {
          name
          value
          rarityPercent
        }
        id
        lastSale {
          eventName
          price {
            denom
            amount
          }
        }
        highestCollectionBidEvent {
          bidder {
            addr
          }
        }
      }
    }
    collections(creatorAddr: $ownerAddr) {
      collections {
        name
        mintedAt
        createdByAddr
        collectionAddr
      }
    }
  }
`;
export const COLLECTION_DATA = gql`
  query Collection($collectionAddr: String!) {
    collection(collectionAddr: $collectionAddr) {
      name
      description
      createdByAddr
      collectionAddr
    }
  }
`;
export const TOKEN_DATA = gql`
  query Collection($collectionAddr: String!, $tokenId: String!) {
    token(collectionAddr: $collectionAddr, tokenId: $tokenId) {
      imageUrl
    }
  }
`;
export const ALL_TOKEN_DATA = gql`
  query Collection($collectionAddr: String!, $tokenId: String!) {
    token(collectionAddr: $collectionAddr, tokenId: $tokenId) {
      imageUrl
      id
      name
      description
      createdAt
      ownerAddr
    }
  }
`;
