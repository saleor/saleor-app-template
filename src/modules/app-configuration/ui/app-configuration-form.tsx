import { SellerShopConfig } from "../app-config";
import { useForm } from "react-hook-form";
import { TextField, TextFieldProps, Typography } from "@material-ui/core";
import { Button, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { actions, useAppBridge } from "@saleor/app-sdk/app-bridge";

const useStyles = makeStyles({
  field: {
    marginBottom: 20,
  },
  form: {
    padding: 20,
  },
  channelName: {
    fontFamily: "monospace",
    cursor: "pointer",
  },
});

type Props = {
  channelSlug: string;
  channelName: string;
  channelID: string;
  onSubmit(data: SellerShopConfig["appConfiguration"]): Promise<void>;
  initialData?: SellerShopConfig["appConfiguration"] | null;
};

export const AppConfigurationForm = (props: Props) => {
  const { register, handleSubmit } = useForm<SellerShopConfig["appConfiguration"]>({
    defaultValues: props.initialData ?? undefined,
  });
  const styles = useStyles();
  const { appBridge } = useAppBridge();

  const CommonFieldProps: TextFieldProps = {
    className: styles.field,
    fullWidth: true,
  };

  const handleChannelNameClick = () => {
    appBridge?.dispatch(
      actions.Redirect({
        to: `/channels/${props.channelID}`,
      })
    );
  };

  return (
    <form
      onSubmit={handleSubmit((data, event) => {
        props.onSubmit(data);
      })}
      className={styles.form}
    >
      <Typography variant="body1" paragraph>
        Configure
        <strong onClick={handleChannelNameClick} className={styles.channelName}>
          {` ${props.channelName} `}
        </strong>
        channel:
      </Typography>
      {/* TODO: add settings form fields UI here */}
      <TextField
        label="Example of secret key input"
        {...CommonFieldProps}
        {...register("exampleSecretKey")}
      />
      <TextField
        label="Example of public key input"
        {...CommonFieldProps}
        {...register("examplePublicKey")}
      />
      <Button type="submit" fullWidth variant="primary">
        Save channel configuration
      </Button>
    </form>
  );
};
