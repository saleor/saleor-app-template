import { NextPage } from "next";
import { LinearProgress, Select, Typography } from "@material-ui/core";
import { trpcClient } from "../trpc-client";
import { PropsWithChildren, useEffect, useState } from "react";

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <div style={{ display: "grid", gridAutoFlow: "column" }}>{children}</div>
);

/**
 * Define fields required by UI to be rendered. Alternatively tRPC inference can be used
 * https://trpc.io/docs/infer-types
 */
type ExampleProductsRenderData = Array<{
  node: {
    id: string;
    name: string;
  };
}>;

const Products = ({ products }: { products: ExampleProductsRenderData }) => {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.node.id}>{product.node.name}</li>
      ))}
    </ul>
  );
};

const TrpcExamplePage: NextPage = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const { data: channelsData } = trpcClient.channels.fetch.useQuery();
  const { data: productsData, isLoading: productsLoading } = trpcClient.products.fetch.useQuery(
    {
      count: 5,
      channel: selectedChannel as string,
    },
    {
      enabled: Boolean(selectedChannel),
    }
  );

  useEffect(() => {
    if (channelsData && channelsData?.data?.channels) {
      setSelectedChannel(channelsData.data.channels[0].slug ?? null);
    }
  }, [channelsData]);

  if (!channelsData?.data) {
    return <LinearProgress />;
  }

  const products = productsData?.data?.products?.edges;

  return (
    <Wrapper>
      <div>
        <Typography variant="caption">Select channel</Typography>
        <Select
          variant="standard"
          value={selectedChannel}
          onChange={(e) => setSelectedChannel(e.target.value as string)}
        >
          {channelsData.data.channels?.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
      {productsLoading && <LinearProgress />}
      {products && products.length > 0 && <Products products={products} />}
      {!productsLoading && products && products.length === 0 && (
        <Typography>No products in selected channel</Typography>
      )}
    </Wrapper>
  );
};

export default TrpcExamplePage;
