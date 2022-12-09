import { NextPage } from "next";
import { Box, LinearProgress, Select, Typography } from "@material-ui/core";
import { Button } from "@saleor/macaw-ui";
import { trpc } from "../trpc";
import { useEffect, useState } from "react";
import { Label } from "@material-ui/icons";

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
      setSelectedChannel(channelsData.data.channels[0].name ?? null);
    }
  }, [channelsData]);

  if (!channelsData?.data) {
    return <LinearProgress />;
  }
  console.log(productsData)

  const products = productsData?.data?.products?.edges;

  return (
    <div style={{ display: "grid", gridAutoFlow: "column" }}>
      <div>
        <Typography variant="caption">Select channel</Typography>
        <Select
          variant="standard"
          value={selectedChannel}
          onChange={(e) => setSelectedChannel(e.target.value as string)}
        >
          {channelsData.data.channels?.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
      {products && products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.node.id}>{product.node.name}</li>
          ))}
        </ul>
      ) : (
        <Typography>No products in selected channel</Typography>
      )}
    </div>
  );
};

export default TrpcExamplePage;
