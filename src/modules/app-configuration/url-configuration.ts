import { SellerShopConfig } from "./app-config";

export const UrlConfiguration = {
  createEmpty(): SellerShopConfig["appConfiguration"] {
    return {
      exampleSecretKey: "",
      examplePublicKey: "",
    };
  },
};
