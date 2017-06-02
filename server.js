var express  = require('express');
var app = express();
var mongojs = require('mongojs'); 
var db = mongojs('mongodb://username:password@connection_url',['collection_name']);
var bodyParser = require('body-parser');
// app.get('/',function(req,res){
// 	res.send('hello world');
// });


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public')); 

app.use(bodyParser.json());

app.get('/feedback', function(req,res){
	//  
	//res.json(feedbackData);
	db.feedback.find(function(err,doc){
		console.log(doc);
		res.json(doc);
	})
});

app.post('/feedback',function(req,res){
	// console.log('test post request',req);
	//console.log('test post request body',req.body);
	db.feedback.insert(req.body,function(err,doc){
		res.json(doc);
		console.log(doc);
	});
});

//app.listen(3000);
//console.log('server is running at 3000');
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});