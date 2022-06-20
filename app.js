const bodyParser = require('body-parser');
const ejs = require('ejs');
const express = require('express');
const mongoose = require('mongoose');
let port = process.env.PORT;

mongoose.connect('mongodb://localhost:27017/wikiDB');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

const articleSchema = mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
.get(function(req, res) {
  Article.find({}, function(error, foundArticles) {
    if (error) {
      res.send(error)
    } else {
      res.send('articles');
    }
  })
})
.post(function(req, res) {
  const title = req.body.title;
  const content = req.body.content;

  const article = new Article({
    title: title,
    content: content
  });

  article.save(function(error, result) {
    if (error) {
      res.send(error);
    } else {
      res.send('Successfully saved a new article');
    }
  })
})
.delete(function(req, res) {
  Article.deleteMany({}, function(error) {
    if (error) {
      res.send(error);
    } else {
      res.send('Successfully deleted all articles')
    }
  })
});

app.route('/articles/:articleTitle')
.get(function(req, res) {
  Article.findOne({title: req.params.articleTitle}, function(error, foundArticle) {
    if (error) {
      res.send(error);
    } else {
      res.send(foundArticle);
    }
  });
})
.put(function(req, res) {
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(error, result) {
      if(error) {
        res.send(error);
      } else {
        res.send('Successfully replaced an article');
      }
    }
  )
})
.patch(function(req, res) {
  Article.updateOne(
    {title: req.params.articleTitle},
    {content: req.body.content},
    function(error, result) {
      if(error) {
        res.send(error);
      } else {
        res.send('Successfully updated an article');
      }
    }
  )
})
.delete(function(req, res) {
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(error) {
      if(error) {
        res.send(error);
      } else {
        res.send('Successfully deleted an article');
      }
    }
  )
})

if (port == null || port == '') {
  port = 3000;
}

app.listen(port, function() {
  console.log('Port Number: ' + port);
});
