/* eslint-disable class-methods-use-this */
import { APL, AuthData } from "@saleor/app-sdk/APL";
import fetch from "node-fetch";

export type RestAPLConfig = {
  setURL: string;
  getURL: string;
  deleteURL: string;
  getAllURL: string;
  headers?: Record<string, string>;
};
export class RestAPL implements APL {
  private setURL: string;

  private getURL: string;

  private deleteURL: string;

  private getAllURL: string;

  private headers?: Record<string, string>;

  constructor(config: RestAPLConfig) {
    this.setURL = config.setURL;
    this.getURL = config.getURL;
    this.deleteURL = config.deleteURL;
    this.getAllURL = config.getAllURL;
    this.headers = config.headers;
  }

  async get(domain: string) {
    console.debug("Getting data from Rest");
    try {
      const response = await fetch(this.getURL, {
        method: "GET",
        headers: { "Content-Type": "application/json", ...this.headers },
        body: JSON.stringify({
          domain,
        }),
      });
      console.debug(`Get responded with ${response.status} code`);

      const parsed = await response.json();
      if (parsed?.domain && parsed.token) {
        return { domain: parsed.domain, token: parsed.token };
      }
    } catch (error) {
      console.debug("Error during getting the data:", error);
    }
    return undefined;
  }

  async set(authData: AuthData) {
    console.debug("Saving data to Rest");
    try {
      const response = await fetch(this.setURL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.headers },
        body: JSON.stringify(authData),
      });
      console.debug(`Set responded with ${response.status} code`);
    } catch (error) {
      console.debug("Error during saving the data:", error);
    }
  }

  async delete(domain: string) {
    console.debug("Deleting data from Rest");
    try {
      const response = await fetch(this.deleteURL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.headers },
        body: JSON.stringify({ domain }),
      });
      console.debug(`Delete responded with ${response.status} code`);
    } catch (error) {
      console.debug("Error during deleting the data:", error);
    }
  }

  async getAll() {
    console.debug("Get all data from Rest");
    try {
      const response = await fetch(this.getAllURL, {
        method: "GET",
        headers: { "Content-Type": "application/json", ...this.headers },
      });
      console.debug(`Get all responded with ${response.status} code`);

      return ((await response.json()) as AuthData[]) || [];
    } catch (error) {
      console.debug("Error during getting all the data:", error);
    }
    return [];
  }
}
