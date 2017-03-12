var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var schema = mongoose.Schema;
var fs = require('fs');

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

mongoose.connect("mongodb://localhost:27017/login", function(err){
  if(err){
    console.log("DB Error!");
    throw err
  }
  else {
    console.log("DB Connect Success!")
  }
})

var UserSchema = new schema({
  name : {
    type : String
  },
  Phonenum : {
    type : String
  },
  email : {
    type : String
  },
  battletag : {
    type : String
  },
  kakaotalk : {
    type : String
  }
})

var User = mongoose.model('user', UserSchema)

app.listen(80, function(){
  console.log("Server Running at 3000 Port")
})

app.get('/',function(req, res){
  fs.readFile('index.ejs', 'utf-8', function(err,data){
    res.send(data)
  })
})
app.get('/chk',function(req, res){
  fs.readFile('check.ejs', 'utf-8', function(err,data){
    res.send(data)
  })
})
app.post('/login', function(req, res){
  User.findOne({
    id: req.param('id')
  }, function(err, result){
    if(err){
      console.log('/login ERR : '+err)
      throw err
    }
    if(result){
      if(result.password == req.param('password')){
        console.log('Login : '+result.username)
        res.json({
          success : true,
          message : "Login Success"
        })
      }
      else if(result.password != req.param('password')){
        console.log('Password Error : '+result.username);
        res.json({
          success: false,
          message: "Password Error"
        })
      }
    }
    else{
      console.log("ID Error")
      res.json({
        success: false,
        message: "ID Error"
      })
    }
  })
})
app.get('/userdataa',function(req, res){
  User.find({

  },function (err, result) {
    if(err){
      console.log('/userdataa Error')
      throw err
    }
    else if(result)
    {
      console.log(result)
      res.json(result)
    }
    else
    {
      res.json({
        sucess : false,
        message : "No Data"
      })
    }
  })
})
app.post('/register', function(req, res){
  user = new User({
    name: req.param('name'),
    email: req.param('email'),
    kakaotalk: req.param('kakaotalk'),
    Phonenum: req.param('Phonenum'),
    battletag: req.param('battletag')
  })

  User.findOne({
    id: req.param('id')
  }, function(err, result){
    if(err){
      console.log("/register Error : "+err)
      throw err
    }
    else {
      user.save(function(err){
        if(err){
          console.log("User save Error")
          throw err
        }
        else {
          console.log(req.param('username')+" Save success")
          res.json({
            success : true,
            message : "Register Success"
          })
        }
      })
    }
  })
})

app.post('/remove', function(req, res){
  User.findOne({
    id: req.param('id')
  }, function(err, result){
    if(err){
      console.log('/remove Error')
      throw err
    }
    if(result){
      if(result.password==req.param('password')){
        user.remove({id: req.param('id')}, function(err){
          if(err){
            console.log('remove Error')
            throw err
          }
          else{
            console.log(result.username+' user remove success')
            res.json({
              success: true,
              message: "user delete success"
            })
          }
        })
      }
      else if(result.password != req.param('password')){
        console.log(result.username+' password Error')
        res.json({
          success: false,
          message: "Password Error"
        })
      }
    }
    else {
      console.log('User Not Founded')
      res.json({
        success: false,
        message: "user not founed"
      })
    }
  })
})
