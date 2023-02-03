export interface SellerShopConfig {
  appConfiguration: {
    exampleSecretKey: string;
    examplePublicKey: string;
  };
}

export type ShopConfigPerChannelSlug = Record<string, SellerShopConfig>;

export type AppConfig = {
  shopConfigPerChannel: ShopConfigPerChannelSlug;
};
