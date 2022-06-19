export const requiredEnviromentalVariables = ["MONGO_DB_CONNECTION_STRING"];

interface Configuration {
  server: {
    port: number;
  };
  mongo: {
    global: string;
  };
  accessToken: {
    secret: string;
    ttl: number;
    algorithm: string;
  };
  refreshToken: {
    secret: string;
    ttl: number;
  };
}

const DEFAULT_VARIABLES = {
  PORT: 3000,
  ACCESS_TOKEN_TTL_SECONDS: 10800, // 3 hours
  REFRESH_TOKEN_TTL_SECONDS: 259200, // 3 days
  ACCESS_TOKEN_ALGORITHM: "HS512",
};

export const configuration = (): Configuration => {
  const defaultConfiguration = {
    server: {
      port: parseInt(process.env.PORT as string, 10) || DEFAULT_VARIABLES.PORT,
    },
    mongo: {
      global: process.env.MONGO_URI as string,
    },
    accessToken: {
      secret: process.env.ACCESS_TOKEN_SECRET as string,
      ttl:
        parseInt(process.env.ACCESS_TOKEN_TTL as string, 10) ||
        DEFAULT_VARIABLES.ACCESS_TOKEN_TTL_SECONDS,
      algorithm: process.env.ACCESS_TOKEN_ALGORITHM || DEFAULT_VARIABLES.ACCESS_TOKEN_ALGORITHM,
    },
    refreshToken: {
      secret: process.env.REFRESH_TOKEN_SECRET as string,
      ttl:
        parseInt(process.env.REFRESH_TOKEN_TTL as string, 10) ||
        DEFAULT_VARIABLES.REFRESH_TOKEN_TTL_SECONDS,
    },
  };

  return defaultConfiguration;
};

export const validateEnvironmentVariables = (): void => {
  if (process.env.NODE_ENV === undefined) {
    process.env.NODE_ENV = "development";
  }

  requiredEnviromentalVariables.forEach((v) => {
    if (!process.env[v]) throw Error(`Missing required env variable ${v}`);
  });
};
