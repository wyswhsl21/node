const path = require('path');

function getPosts(req, res) {
  res.render('posts', {
    templateName: 'post',
  });
  //   res.send(`<div><h1>Post Title</h1><p>This is a post </p></div>`);
}

module.exports = {
  getPosts,
};
