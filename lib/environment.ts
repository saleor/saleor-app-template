import { promises as fsPromises } from "fs";
import fetch from "node-fetch";

interface IEnvVar {
  key: string;
  value: string;
}

const ENVFILE = ".envfile";

export const getEnvVars = async () => {
  let variables;
  if (process.env.VERCEL === "1") {
    variables = process.env;
  } else {
    try {
      await fsPromises.access(ENVFILE);
      variables = JSON.parse(await fsPromises.readFile(ENVFILE, "utf-8"));
    } catch {
      variables = {};
    }
  }

  console.debug("Using environment variables: ", variables);
  return variables;
};

export const setEnvVars = async (variables: IEnvVar[]) => {
  console.debug("Setting environment variables: ", variables);

  if (process.env.VERCEL === "1") {
    await fetch(process.env.SALEOR_MARKETPLACE_REGISTER_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        marketplace_token: process.env.SALEOR_MARKETPLACE_TOKEN,
        envVars: variables.map(({ key, value }) => ({ key, value })),
      }),
    });
  } else {
    let currentEnvVars;
    try {
      await fsPromises.access(ENVFILE);
      currentEnvVars = JSON.parse(await fsPromises.readFile(ENVFILE, "utf-8"));
    } catch {
      currentEnvVars = {};
    }

    await fsPromises.writeFile(
      ENVFILE,
      JSON.stringify({
        ...currentEnvVars,
        ...variables.reduce((acc, cur) => ({ ...acc, [cur.key]: cur.value }), {}),
      })
    );
  }
};
