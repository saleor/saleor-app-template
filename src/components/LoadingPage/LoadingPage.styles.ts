import { makeStyles } from "@saleor/macaw-ui";

export const useLoadingPageStyles = makeStyles((theme) => ({
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  message: {
    marginTop: theme.spacing(4),
  },
}));
