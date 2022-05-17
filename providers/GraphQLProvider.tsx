import { Provider } from "urql";
import { PropsWithChildren } from "react";

import { createClient } from "../lib/graphql";
import useApp from "../hooks/useApp";

const GraphQLProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const app = useApp();
  const domain = app?.getState().domain!;

  const client = createClient(
    `https://${domain}/graphql/`,
    async () => Promise.resolve({ token: app?.getState().token! }),
  );

  return <Provider value={client} {...props} />;
};

export default GraphQLProvider;
