import { FileAPL, VercelAPL } from "@saleor/app-sdk/APL";

// For local development store auth data in the `.auth-data.json`.
// For app deployment on Vercel with Saleor CLI, use vercelAPL.
export const apl = process.env.VERCEL === "1" ? new VercelAPL() : new FileAPL();
