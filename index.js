const fetch = require("node-fetch");
const Twit = require("twit");
const graph = require("fbgraph");

const { words } = require("./words.js");

async function getMeaning(word) {
  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.dictionary_api_key}`
  );
  const json = await response.json();

  let meaning = "";

  if (json.length && json[0].shortdef) {
    const meanings = json.reduce((arr, m) => [...arr, ...m.shortdef], []);

    meaning = meanings[Math.floor(Math.random() * meanings.length)];
  }

  return meaning;
}

function facebook(text) {
  console.log("facebook", text);

  // facebook
  graph.setAccessToken(process.env.fb_dj_access_token);

  // get page accounts
  graph.get("me/accounts", function(err, res) {
    const dj = res.data.find(p => p.name === "Daily Jzx");

    // change access token to page's
    graph.setAccessToken(dj.access_token);

    // create message
    var post = {
      message: text
    };

    // post to page
    graph.post("/" + dj.id + "/feed", post, function(err, res) {
      // console.log(res)
    });
  });
}

function tweet(text) {
  console.log("tweet", text);

  const T = new Twit({
    consumer_key: process.env.tw_jzx_consumer_key,
    consumer_secret: process.env.tw_jzx_consumer_secret,
    access_token: process.env.tw_jzx_oauth_token,
    access_token_secret: process.env.tw_jzx_oauth_token_secret
  });

  // tweet

  T.post("statuses/update", { status: text }, function(err) {
    if (err) {
      console.log(err);
    }
  });
}

async function post() {
  // pick one at random
  const word = words[Math.floor(Math.random() * words.length)];

  console.log("word", word);

  const meaning = await getMeaning(word);

  console.log("meaning", meaning);

  const text = meaning ? `${word}: ${meaning}` : word;

  tweet(text);

  facebook(text);

  return word;
}

// test - remove before deploying

// post()

// lambda
exports.handler = function(event, context, callback) {
  const word = post();

  callback(null, `posted ${word}`);
};
