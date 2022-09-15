import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { useEffect, useState } from "react";

interface UseFetchProps {
  url: string;
  options?: RequestInit;
  skip?: boolean;
}

/**
 * This is a simple API client that wraps Fetch API and stores it in local state.
 *
 * In larger app this can be replaced with swr or react-query
 */
export const useFetch = <D>({ url, options, skip }: UseFetchProps) => {
  const { appBridgeState } = useAppBridge();

  const [data, setData] = useState<D>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  const fetchOptions: RequestInit = {
    ...options,
    headers: [
      [SALEOR_DOMAIN_HEADER, appBridgeState?.domain!],
      ["authorization-bearer", appBridgeState?.token!],
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
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    if (appBridgeState?.ready && !skip) {
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
