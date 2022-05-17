import { createClient, Provider, dedupExchange, cacheExchange, fetchExchange } from "urql";
import { authExchange } from '@urql/exchange-auth';
import { PropsWithChildren } from "react";

import useApp from "../hooks/useApp";

interface IAuthState {
  token: string;
}

const GraphQLProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const { domain, token } = useApp()?.getState() || {};
  const client = createClient({
    url :`https://${domain}/graphql/`,
    exchanges: [
      dedupExchange,
      cacheExchange,
      authExchange<IAuthState>({
        addAuthToOperation: ({ authState, operation }) => {
          if (!authState || !authState?.token) {
            return operation;
          }

          const fetchOptions =
            typeof operation.context.fetchOptions === 'function'
              ? operation.context.fetchOptions()
              : operation.context.fetchOptions || {};

          return {
            ...operation,
            context: {
              ...operation.context,
              fetchOptions: {
                ...fetchOptions,
                headers: {
                  ...fetchOptions.headers,
                  "Authorization-Bearer": authState.token,
                },
              },
            },
          };
        },
        getAuth: async ({ authState, mutate }) =>  {
          return { token };
        },
      }),
      fetchExchange,
    ],
  });

  return <Provider value={client} {...props} />;
};

export default GraphQLProvider;
