import { NextPage } from "next";
import { ComponentProps, ComponentType } from "react";
import { AuthorizedPage } from "../components/AuthorizedPage/AuthorizedPage";

export const withDashboardRequired =
  <Props extends ComponentProps<NextPage>>(WrappedPage: ComponentType<Props>) =>
  (props: Props) => {
    return (
      <AuthorizedPage>
        <WrappedPage {...props} />
      </AuthorizedPage>
    );
  };
