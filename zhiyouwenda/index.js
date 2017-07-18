// 加载模块
var express = require('express');
var bodyParser = require('body-parser');

// 处理缓存cookie
var cookieParser = require('cookie-parser');




var fs = require('fs');
var multer = require('multer');

// 配置存储上传文件的storage
// var storage = multer.diskStorage({
//     destination:'wwwroot/uploads',
//     filename:function(req,res,callback){
//         var petname = req.cookies.petname;
//         callback(null,petname + 'jpg');
//     }
// });
// var upload = multer({storage});

// 创建服务器对象
var app = express();

// 配置静态文件夹
app.use(express.static('wwwroot'))
// 解析post请求参数
app.use(bodyParser.urlencoded({extended:true}));

// 解析cookie参数的中间件
app.use(cookieParser());
app.listen(3000,function(){
    console.log('服务器已开启！');
})