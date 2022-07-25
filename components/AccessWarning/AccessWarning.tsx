import { Typography } from "@material-ui/core";
import React from "react";

type WarningCause = "iframe" | "token" | "invalid_token";

interface AccessWarningProps {
  cause?: WarningCause;
}

const warnings: Record<WarningCause, string> = {
  iframe: "The view can only be displayed in the iframe.",
  token: "App doesn't have an access token.",
  invalid_token: "Access token is invalid.",
};

const AccessWarning = ({ cause }: AccessWarningProps) => (
  <div suppressHydrationWarning>
    <Typography variant="subtitle1">
      App can&apos;t be accessed outside of the Saleor Dashboard
    </Typography>
    <Typography variant="subtitle2" style={{ marginTop: "2rem" }}>
      ❌ {cause ? warnings[cause] : "Something went wrong"}
    </Typography>
  </div>
);

export default AccessWarning;
