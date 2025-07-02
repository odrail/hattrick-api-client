export default interface HattrickApiClientConfig {
  oauth_consumer_key: string;
  oauth_consumer_secret: string;
  oauth_access_token?: string;
  oauth_access_token_secret?: string;
  oauth_callback?: string; // Optional callback URL, default is "oob"
}