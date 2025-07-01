import HattrickApiClient, { Scope } from "./src/HattrickApiClient"

const hattrickApiClient = new HattrickApiClient({
  oauth_consumer_key: "8OLY975uW761989SmI8LFh",
  oauth_consumer_secret: "c9HLQDQoHqLAhT2Qt84tHerBZLMoDWnJBYbVg8WnwYk",
  oauth_access_token: 'FYRNwkKXZFVOlfGT',
  oauth_access_token_secret: 'QSFoxOxlC3aaJfzh',
})

// hattrickApiClient.getRequestToken([
//   Scope.MANAGE_CHALLENGES,
//   Scope.SET_MATCH_ORDER,
//   Scope.MANAGE_YOUTH_PLAYERS,
//   Scope.SET_TRAINING,
//   Scope.PLACE_BID
// ])
//   .then(url => {
//     console.log("Authorize URL:", url);
//   })
//   .catch(err => {
//     console.error("Error getting authorize URL:", err);
//   });

// hattrickApiClient.getAccessToken({
//   oauth_token: 'oRFLEQUn8IYdfDA1',
//   oauth_token_secret: 'JTV26a7etxUaF7k3',
//   oauth_verifier: '8cpAt4zZDFm4e5fk'
// })
//   .then(token => {
//     console.log("Access Token:", token);
//   })
//   .catch(err => {
//     console.error("Error getting access token:", err);
//   });


hattrickApiClient.checkToken()
  .then(data => {
    console.log("check Token Data:", data);
  })
  .catch(err => {
    console.error("Error checking token:", err);
  });