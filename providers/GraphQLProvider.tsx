import { PropsWithChildren } from "react";
import { Provider } from "urql";

import useApp from "../hooks/useApp";
import { createClient } from "../lib/graphql";

function GraphQLProvider(props: PropsWithChildren<{}>) {
  const app = useApp();
  const domain = app?.getState().domain!;

  const client = createClient(`https://${domain}/graphql/`, async () =>
    Promise.resolve({ token: app?.getState().token! })
  );

  return <Provider value={client} {...props} />;
}

export default GraphQLProvider;
