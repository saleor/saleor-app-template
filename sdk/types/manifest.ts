export interface ExtensionManifest {
  label: string;
  mount: string;
  target: string;
  permissions: string[];
  url: string;
}

export interface WebhookManifest {
  name: string;
  events: string[];
  query?: string;
  targetUrl: string;
  isActive: boolean;
}

export interface Manifest {
  id: string;
  version: string;
  name: string;
  about: string;
  permissions: string[];
  appUrl: string;
  configurationUrl?: string;
  tokenTargetUrl?: string;
  dataPrivacy?: string;
  dataPrivacyUrl?: string;
  homepageUrl?: string;
  supportUrl?: string;
  extensions: ExtensionManifest[];
  webhooks: WebhookManifest[];
}

export type ManifestFunction = (baseUrl: string) => Manifest;
