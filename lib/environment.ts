import fs from "fs";
import fetch from "node-fetch";

export const getAuthToken = () => {
  if (process.env.VERCEL === "1") {
    return process.env.AUTH_TOKEN || "";
  } else {
    return fs.readFileSync(".auth_token", "utf8");
  }
};

export const setAuthToken = async (token: string) => {
  if (process.env.VERCEL === "1") {
    await fetch(
      process.env.SALEOR_MARKETPLACE_REGISTER_URL as string,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          marketplace_token: process.env.SALEOR_MARKETPLACE_TOKEN,
        }),
      },
    );
  } else {
    fs.writeFileSync(".auth_token", token);
  }
};
