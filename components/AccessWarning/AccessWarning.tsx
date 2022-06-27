import { Typography } from "@material-ui/core";
import React from "react";

const AccessWarning: React.FC = () => (
  <div suppressHydrationWarning>
    <Typography variant="subtitle1">
      App can't be accessed outside of the Saleor Dashboard
    </Typography>
  </div>
);

export default AccessWarning;
