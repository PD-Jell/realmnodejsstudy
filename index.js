// 실행할 때에는 터미널에 npm run serve로 켜면 됨!
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var Realm = require('realm');

var app = express();

app.set('view engine', 'ejs');

let PostSchema = {
    name: 'Post',
    properties: {
        timestamp: 'date',
        title: 'string',
        content: 'string'
    }
};

var blogRealm = new Realm({
    path: 'blog.realm',
    schema: [PostSchema] 
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/write', function(req, res) {
    // res.send(req.body); // 원문 그대로 클라이언트에 돌려준다.
    let title = req.body['title'],
    content = req.body['content'],
    timestamp = new Date();
    blogRealm.write(() => {
        blogRealm.create('Post', {
            title: title,
            content: content,
            timestamp: timestamp
        });
    });
    res.sendFile(__dirname + "/write-complete.html");
});

app.get('/', function(req, res){
    // res.send("Hello World!");
    let posts = blogRealm.objects('Post').sorted('timestamp', true); // true는 Reverse의 여부.
    res.render('index', {
        posts: posts
    });
});

app.get('/write', function(req, res) {
    res.sendFile(__dirname + "/write.html");
});

app.listen(3000, function() {
    console.log("Go!");
});