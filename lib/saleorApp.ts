import { RestAPL } from "./RestAPL";

// For local development store auth data in the `.auth-data.json`.
// For app deployment on Vercel with Saleor CLI, use vercelAPL.
export const apl = new RestAPL({
  url: process.env.AUTH_URL!,
  headers: {
    Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
  },
});
