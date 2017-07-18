var express = require('express');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var fs = require('fs');
var multer = require('multer');

var storage = multer.diskStorage({
	destination: 'wwwroot/uploads',
	filename: function(req, res, callback) {
		var petname = req.cookies.petname;
		callback(null, petname + 'jpg');
	}
});
var upload = multer({ storage });

var app = express();

app.use(express.static('wwwroot'))

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

function(err) {
	if(err) {

		res.status(200).json({
			message: app.post('/user/register', function(req, res) {

				console.log('已进入注册请求')

				fs.exists('users', function(exist) {
					if(exist) {

						writeFile();
					} else {

						fs.mkdir('users', function(err) {
							if(err) {
								res.status(200).json({
									message: '系统创建文件失败'
								})
							} else {

								writeFile();
							}
						})
					}
				});

				function writeFile() {

					var fileName = 'users/' + req.body.petname + '.txt';
					fs.exists(fileName, function(exist) {
						if(exist) {

							res.status(200).json({ message: "用户名已经存在，请重新注册" })
						} else {

							fs.writeFile(fileName, JSON.stringify(req.body), function(err) {
								if(err) {
									res.status(200).json({
										message: "写入文件失败"
									});
								} else {
									res.status(200).json({
										code: '1',
										message: "注册成功"
									});
								}
							});
						}
					});
				}
			});

			app.post('/user/login', function(req, res) {

				var fileName = 'users/' + req.body.petname + '.txt';
				fs.exists(fileName, function(exist) {
					if(exist) {

						fs.readFile(fileName, function(err, data) {
							if(err) {
								res.status(200).json({
									message: "文件读取失败"
								});
							} else {

								var userData = JSON.parse(data);
								if(userData.password == req.body.password) {

									var expires = new Date();
									expires.setMonth(expires.getMonth() + 1);
									res.cookie('petname', req.body.petname, { expires })

									res.status(200).json({
										code: "1",
										message: "登录成功"
									});
								} else {
									res.status(200).json({
										message: "密码错误"
									});
								}
							}
						});
					} else {

						res.status(200).json({
							message: "用户不存在，请先注册"
						})
					}
				})
			});

			app.post('/user/ask', function(req, res) {

					console.log(req.cookies);

					if(!req.cookies.petname) {
						res.status(200).json({
							message: "登录超时，请重新登录"
						})
						return;
					}

					fs.exists('questions', function(exist) {
							if(exist) {

								writeFile();
							} else {

								fs.mkdir('questions', "文件创建失败"
								})
						} else {

							writeFile();
						}
					})
			}
		})

		function writeFile() {

			var date = new Date();
			var fileName = 'questions/' + date.getTime() + '.txt';

			req.body.petname = req.cookies.petname
			req.body.ip = req.ip
			req.body.time = date

			fs.writeFile(fileName, JSON.stringify(req.body), function(err) {
				if(err) {
					res.status(200).json({
						message: "写入文件失败"
					});
				} else {
					res.status(200).json({
						code: "1",
						message: "写入文件成功"
					});
				}
			})
		}
	})

app.get('/question/all', function(req, res) {

	fs.readdir('questions', function(err, files) {
		if(err) {
			res.status(200).json({ message: "文件夹读取失败" });
		} else {

			files = files.reverse();

			var questions = [];

			for(var i = 0; i < files.length; i++) {
				var file = files[i];

				var filePath = 'questions/' + file

				var data = fs.readFileSync(filePath)

				var object = JSON.parse(data)

				questions.push(object);
			}
			/
			res.status(200).json(questions);
		}
	})

})

app.post('/user/answer', function(req, res) {

	if(!req.cookies.petname) {
		res.status(200).json({ code: 0, message: '登录异常,请重新登录' });
		return;
	}

	var question = req.cookies.question;
	var filePath = 'questions/' + question + '.txt';
	fs.readFile(filePath, function(err, data) {
		if(!err) {
			var object = JSON.parse(data);

			if(!object.answers) {

				object.answers = [];
			}

			req.body.content = req.body.content.replace(/</g, '&lt;');
			req.body.content = req.body.content.replace(/>/g, '&gt;');

			req.body.ip = req.ip;
			req.body.question = question;
			req.body.time = new Date();
			req.body.petname = req.cookies.petname;

			object.answers.push(req.body);
			fs.writeFile(filePath, JSON.stringify(object), function(err) {
				if(err) {

					res.status(200).json({ message: '系统错误,写入文件失败' });
				} else {

					res.status(200).json({ code: 1, message: '回复成功' });
				}
			});
		}
	});
});

app.post('/user/photo', upload.single('photo'), function(req, res) {

	res.status(200).json({
		code: "1",
		message: "上传成功"
	})
})

app.get('/user/logout', function(req, res) {
	res.clearCookie('petname')
	res.status(200).json({
		message: "退出成功"
	});
});

app.listen(3000, function() {
	console.log('服务器已开启');
})