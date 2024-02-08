import fetch from "node-fetch";

export const devMode = process.env.NODE_ENV === "dev";
export const baseURLRails = devMode
  ? process.env.RAILS_SERVER_URL_DEV
  : process.env.RAILS_SERVER_URL_PRODUCTION;

export const appendApiKeyParam = (url: string) =>
  url +
  "?API_KEY=" +
  encodeURIComponent(process.env.SOCKET_SERVER_API_KEY ?? "");

export const getUserType = async (
  accessToken: string
): Promise<false | "user" | "admin"> => {
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

  if (userType === "admin") {
    return "admin";
  }

  if (userType === "user") {
    return "user";
  }

  return false;
};
