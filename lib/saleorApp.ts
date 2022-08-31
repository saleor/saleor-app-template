import { RestAPL } from "./RestAPL";

// For local development store auth data in the `.auth-data.json`.
// For app deployment on Vercel with Saleor CLI, use vercelAPL.
export const apl = new RestAPL({
  setURL: "http://example.com/set",
  getURL: "http://example.com/get",
  deleteURL: "http://example.com/delete",
  getAllURL: "http://example.com/getAll",
  headers: {
    some: "headers",
  },
});
