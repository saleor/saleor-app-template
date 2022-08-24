export interface AuthData {
  domain: string;
  token: string;
}

export interface APL {
  get: (domain: string) => Promise<AuthData | undefined>;
  set: (authData: AuthData) => Promise<void>;
  delete: (domain: string) => Promise<void>;
  // todo: implement pagination
  list: () => Promise<AuthData[]>;
}
