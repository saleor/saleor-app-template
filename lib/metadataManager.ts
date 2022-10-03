import { Client } from "urql";

import {
  FetchAppDetailsDocument,
  FetchAppDetailsQuery,
  UpdateAppMetadataDocument,
} from "../generated/graphql";

const debug = console.error;

export type SettingsValueWithEnv = {
  key: string;
  value: string;
  domain?: string;
};

export interface SettingsManager {
  get: (key: string, domain?: string) => Promise<string | undefined>;
  set: (settings: SettingsValueWithEnv[] | SettingsValueWithEnv) => Promise<void>;
}

const deserializeMetadata = (key: string, value: string): SettingsValueWithEnv => {
  // domain specific metadata use convention key__domain, e.g. `secret_key__example.com`
  const [newKey, domain] = key.split("__");

  return {
    key: newKey,
    domain,
    value,
  };
};

const serializeSettingsToMetadata = ({
  key,
  value,
  domain,
}: SettingsValueWithEnv): { key: string; value: string } => {
  // domain specific metadata use convention key__domain, e.g. `secret_key__example.com`
  if (!domain) {
    return { key, value };
  }

  return {
    key: [key, domain].join("__"),
    value,
  };
};

export class MetadataManager implements SettingsManager {
  private client: Client;

  private settings: SettingsValueWithEnv[];

  private appId?: string;

  constructor(client: Client) {
    this.client = client;
    this.settings = [];
  }

  private async fetchAllMetadata() {
    const { error, data } = await this.client
      .query<FetchAppDetailsQuery>(FetchAppDetailsDocument, {})
      .toPromise();

    if (error) {
      debug("Error during fetching the metadata: ", error);
      this.settings = [];
    }

    this.settings =
      data?.app?.privateMetadata.map((md) => deserializeMetadata(md.key, md.value)) || [];
  }

  private async mutateMetadata(metadata: { key: string; value: string }[]) {
    // to update the metadata, ID is required
    if (!this.appId) {
      const { error: idQueryError, data: idQueryData } = await this.client
        .query(FetchAppDetailsDocument, {})
        .toPromise();

      if (idQueryError) {
        debug("Could not fetch the app id: ", idQueryError);
        throw new Error("Could not fetch the app id");
      }

      const appId = idQueryData?.app?.id;

      if (!appId) {
        debug("Missing app id");
        throw new Error("Could not fetch the app ID");
      }

      this.appId = appId;
    }

    const { error: mutationError, data: mutationData } = await this.client
      .mutation(UpdateAppMetadataDocument, {
        id: this.appId,
        input: metadata,
      })
      .toPromise();

    if (mutationError) {
      debug("Mutation error: ", mutationError);
      throw new Error(`Mutation error: ${mutationError.message}`);
    }

    return (
      mutationData?.updatePrivateMetadata?.item?.privateMetadata.map((md) => ({
        key: md.key,
        value: md.value,
      })) || []
    );
  }

  async get(key: string, domain?: string) {
    if (!this.settings.length) {
      await this.fetchAllMetadata();
    }

    const setting = this.settings.find((md) => md.key === key && md.domain === domain);
    return setting?.value;
  }

  async set(settings: SettingsValueWithEnv[] | SettingsValueWithEnv) {
    let serializedMetadata = [];
    if (Array.isArray(settings)) {
      serializedMetadata = settings.map((md) => serializeSettingsToMetadata(md));
    } else {
      serializedMetadata = [serializeSettingsToMetadata(settings)];
    }
    // changes should update cache
    this.settings = await this.mutateMetadata(serializedMetadata);
  }
}
