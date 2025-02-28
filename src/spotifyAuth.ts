import axios, { AxiosError} from "axios";

/**
 * Redirects the user to Spotify's authorization endpoint.
 */
export const loginWithSpotify = () => {
  console.log("🚀 loginWithSpotify() triggered!");

  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const CLIENT_ID = "8723d4814d08440b84abc2f3f021f5fc";
  const REDIRECT_URI = "http://localhost:5173/callback"; 
  const RESPONSE_TYPE = "code";
  const SCOPES = "user-read-private user-read-email";

  const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}`;

  console.log("🔗 Redirecting to Spotify Auth URL:", authUrl);
  window.location.href = authUrl;
};

/**
 * Retrieves the Spotify access token from localStorage or from the URL hash.
 * If the token is found in the URL hash, it is stored in localStorage and the URL is cleaned.
 * @returns {string | null} The Spotify access token or null if not found.
 */
export const getSpotifyToken = () => {
  const hash = window.location.hash;
  let token = localStorage.getItem("spotify_token");

  if (hash.includes("access_token")) {
    const params = new URLSearchParams(hash.substring(1));
    token = params.get("access_token");

    if (token) {
      localStorage.setItem("spotify_token", token); 
      // Clean the URL to remove token parameters without reloading the page
      window.history.replaceState(null, "", window.location.pathname); 
    }
  }
  return token;
};

/**
 * Exchanges an authorization code for Spotify access and refresh tokens.
 * On success, stores the tokens and expiry time in localStorage.
 * @param code - The authorization code from Spotify.
 * @returns {Promise<string | null>} The access token if successful, or null if failed.
 */
export const exchangeCodeForTokens = async (code: string): Promise<string | null> => {
  try {
    console.log("🚀 Sending authorization code to backend:", code);

    const response = await axios.post("http://localhost:3001/auth/spotify", { code });

    if (response.data.access_token) {
      const { access_token, refresh_token, expires_in } = response.data;

      localStorage.setItem("spotify_token", access_token);
      localStorage.setItem("spotify_refresh_token", refresh_token);
      localStorage.setItem("spotify_token_expiry", (Date.now() + expires_in * 1000).toString());

      return access_token;
    } else {
      console.error("❌ Token exchange response missing access_token.");
      return null;
    }
  } catch (err: unknown) {
    const error = err as AxiosError;
    console.error("❌ Failed to exchange code for tokens:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Refreshes the Spotify access token using the stored refresh token.
 * Updates the stored access token and expiry time in localStorage.
 * @returns {Promise<string | null>} The new access token if successful, or null if failed.
 */
export const refreshSpotifyToken = async (): Promise<string | null> => {
  const refresh_token = localStorage.getItem("spotify_refresh_token");
  if (!refresh_token) return null;

  try {
    const response = await axios.post("http://localhost:3001/refresh", { refresh_token });
    const { access_token, expires_in } = response.data;

    localStorage.setItem("spotify_token", access_token);
    localStorage.setItem("spotify_token_expiry", (Date.now() + expires_in * 1000).toString());

    return access_token;
  } catch (error) {
    console.error("❌ Failed to refresh Spotify token", error);
    return null;
  }
};

/**
 * Logs out the Spotify user by clearing tokens from localStorage and redirecting to the login page.
 * @param navigate - A function to navigate to a specified route.
 */
export const logoutFromSpotify = (navigate: (path: string) => void): void => {
  window.location.hash = ""; // Clears any token parameters from the URL
  localStorage.removeItem("spotify_token");
  localStorage.removeItem("spotify_refresh_token");
  localStorage.removeItem("spotify_token_expiry");
  navigate("/login"); 
};

