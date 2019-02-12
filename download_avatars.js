let request = require('request');
let load = require('./secrets.js');
let fs = require('fs');
let var1 = process.argv[2];
let var2 = process.argv[3];

console.log(var1, var2);

function getRepoContributors(repoOwner, repoName, cb) {

  let options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + load.GITHUB_TOKEN,
    }
  };

  request(options, function (err, result, body) {
      let users = JSON.parse(body);
      for (let userInfo of users) {
    cb(err, userInfo);
      }
  });

}
getRepoContributors(var1, var2, function (err, result) {
    if(var1 === undefined || var2 === undefined) {
      console.log('Enter both requirements.')
      throw err
    } else {
  downloadImageByURL(result['avatar_url'], `avatars/${result.login}.jpg`);
    }
});

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function(err) {
      throw err;
    })
    .on('response', function(response) {
      console.log('Response status code:', response.statusCode);
    })
    .pipe(fs.createWriteStream(filePath));
}
