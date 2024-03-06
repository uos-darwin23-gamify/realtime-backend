import fetch from "node-fetch";

export const MINIMUM_TIME_TO_REGISTER_NEW_ACTIVITY_SESSION_SECONDS = 10;
export const devMode = process.env.NODE_ENV === "dev";
export const baseURLRails = devMode
  ? process.env.RAILS_SERVER_URL_DEV
  : process.env.RAILS_SERVER_URL_PRODUCTION;

export const appendApiKeyParam = (url: string) =>
  url +
  "?API_KEY=" +
  encodeURIComponent(process.env.SOCKET_SERVER_API_KEY ?? "");

export const getUserTypeAndEmail = async (
  accessToken: string
): Promise<false | { userType: "user" | "admin"; email: string }> => {
  const response = await fetch(
    appendApiKeyParam(baseURLRails + "/auth/status"),
    {
      method: "POST",
      body: JSON.stringify({ access_token: accessToken }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  const userType = data.userType;
  const email = data.email;

  if (userType === "admin") {
    return { userType: "admin", email };
  }

  if (userType === "user") {
    return { userType: "user", email };
  }

  return false;
};

export const registerUserConnect = async (accessToken: string) => {
  const response = await fetch(
    appendApiKeyParam(baseURLRails + "/activity/connect"),
    {
      method: "POST",
      body: JSON.stringify({ access_token: accessToken }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.ok;
};

export const registerUserDisconnect = async (accessToken: string) => {
  const response = await fetch(
    appendApiKeyParam(baseURLRails + "/activity/disconnect"),
    {
      method: "POST",
      body: JSON.stringify({ access_token: accessToken }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.ok;
};
