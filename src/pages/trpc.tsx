import { NextPage } from "next";
import { Box } from "@material-ui/core";
import { Button } from "@saleor/macaw-ui";
import { trpc } from "../trpc";

const TrpcExamplePage: NextPage = () => {
  const { data, refetch } = trpc.products.fetch.useQuery(
    {
      count: 5,
    },
    {

    }
  );

  console.log(data);

  return (
    <Box>
      <Button onClick={() => refetch()}>Fetch products using tRPC client</Button>
    </Box>
  );
};

export default TrpcExamplePage;
