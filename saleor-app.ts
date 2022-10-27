import { SaleorApp } from "@saleor/app-sdk/saleor-app";
import { FirestoreAPL } from "@saleor/app-sdk/APL";
import { Firestore } from "@google-cloud/firestore";

/**
 * Follow Firestore docs to configure client
 */
export const firestore = new Firestore({
  projectId: "your-firestore-id",
  credentials: {
    private_key: "your-key",
    client_email: "your-email",
  },
});

export const apl = new FirestoreAPL(firestore.collection("apl"));

export const saleorApp = new SaleorApp({
  apl,
});
