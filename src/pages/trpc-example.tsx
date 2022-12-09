import { NextPage } from "next";
import { LinearProgress, Select, Typography } from "@material-ui/core";
import { trpc } from "../trpc";
import { PropsWithChildren, useEffect, useState } from "react";

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <div style={{ display: "grid", gridAutoFlow: "column" }}>{children}</div>
);

const Products = ({
  products,
}: {
  products: Array<{
    node: {
      id: string;
      name: string;
    };
  }>;
}) => {
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
  const { data: channelsData } = trpc.channels.fetch.useQuery();
  const { data: productsData } = trpc.products.fetch.useQuery(
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
      {products && products.length > 0 ? (
        <Products products={products} />
      ) : (
        <Typography>No products in selected channel</Typography>
      )}
    </Wrapper>
  );
};

export default TrpcExamplePage;
