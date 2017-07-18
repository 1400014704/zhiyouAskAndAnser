var express = require('express');
var bodyParser = require('body-parser');

var fs = require('fs');
var multer = require('multer');
var form = multer();
var app = express();

app.use(express.static('wwwroot'))

app.use(bodyParser.urlencoded({
	extended: true
}));

var users = [];
var txt = [];
app.post('/zc',form.array(), function(req, res) {

	var isUser = false;

	var name = req.body.username;
	var pwd = req.body.pwd;

	if(name.length == 0) {
		res.send('用户名不能为空');
	} else if(pwd.length == 0) {
		res.send('密码不能为空')
	} else {

		for(var i = 0; i < users.length; i++) {

			if(users[i].name == name) {

				isUser = true;

				break;
			}
		}

		if(isUser == true) {
			res.send('用户名已经存在，重起一个名字吧！')
		} else {

			var newUser = {
				name: name,
				pwd: pwd
			}

			users.push(newUser);
		}

		var result = '注册成功啦!' + '<script>setTimeout(function(){location.href="login.html"},1000)</script>'
		res.send(result);
		console.log(users)
	}
	
	
	fs.exists('saveData',function(exist){
		if(!exist){
			fs.mkdirSync('saveData');
		}
	});
	fs.appendFile('saveData/message.txt',JSON.stringify(users)+',',function(error){
		if(error){
			console.log('留言出错'+error)
		}else{
			console.log('留言成功')
		}
	})
	res.send({
		state: 'success',
		info: '谢谢留言',
	})

})

app.post('/login', function(req, res) {

			var name = req.body.username;
			var pwd = req.body.pwd;

			var userIndex = null;

			for(var i = 0; i < users.length; i++) {

				if(name == users[i].name) {

					//          userIndex = i;
					if(pwd == users[i].pwd) {

						var result = '登录成功啦!' + '<script>setTimeout(function(){location.href="index.html"},2000)</script>'
						res.send(result);
					} else {
						res.send('密码错啦！！！')
					}
				} else {
					res.send('用户不存在！快去注册一个！')
				}
			}
			});




		app.listen(3000, function() {
			console.log('服务器已开启');
		})