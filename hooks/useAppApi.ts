import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { useEffect, useState } from "react";

import useApp from "./useApp";

type Options = Record<string, string>;

interface UseFetchProps {
  url: string;
  options?: Options;
  skip?: boolean;
}

// This hook is meant to be used mainly for internal API calls
const useAppApi = ({ url, options, skip }: UseFetchProps) => {
  const _app = useApp();
  const appState = _app?.getState();

  const [data, setData] = useState<any>();
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState(false);

  const fetchOptions = {
    ...options,
    headers: [
      [SALEOR_DOMAIN_HEADER, appState?.domain!],
      ["authorization-bearer", appState?.token!],
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(undefined);

      try {
        const res = await fetch(url, fetchOptions);

        if (!res.ok) {
          throw new Error(`Error status: ${res.status}`);
        }

        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e as unknown);
      } finally {
        setLoading(false);
      }
    };

    if (appState?.ready && !skip) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchData();
    }

    return () => {
      setLoading(false);
      setError(undefined);
      setData(undefined);
    };
  }, [url, options, skip]);

  return { data, error, loading };
};

export default useAppApi;
