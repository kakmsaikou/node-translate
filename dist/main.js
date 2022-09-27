"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
const https = __importStar(require("https"));
const querystring = __importStar(require("querystring"));
const md5 = require("md5");
const private_1 = require("./private");
const errorMap = {
    52001: '请求超时，请重试',
    52002: '系统错误，请重试',
    52003: '未授权用户，请检查appid是否正确或者服务是否开通',
    54000: '必填参数为空，请检查是否少传参数',
    54001: '签名错误，请检查您的签名生成方法',
    54003: '访问频率受限，请降低您的调用频率，或进行身份认证后切换为高级版/尊享版',
    54004: '账户余额不足，请前往管理控制台为账户充值',
    54005: '长query请求频繁，请降低长query的发送频率，3s后再试',
    58000: '客户端IP非法，请检查个人资料里填写的IP地址是否正确',
    58001: '译文语言方向不支持，请检查译文语言是否在语言列表里',
    58002: '服务当前已关闭，请前往管理控制台开启服务',
    90107: '认证未通过或未生效，请前往我的认证查看认证进度',
};
const translate = (word) => {
    const salt = Math.random();
    const sign = md5(private_1.appId + word + salt + private_1.appSecret);
    let from, to;
    // 检查输入内容是否为中文
    if (/[a-zA-Z]/.test(word[0])) {
        // 英译为中
        from = 'en';
        to = 'zh';
    }
    else {
        // 中译为英
        from = 'zh';
        to = 'en';
    }
    // 生成查询字符串
    const query = querystring.stringify({
        q: word,
        appid: private_1.appId,
        from, to, salt, sign
    });
    // 包含 url 和请求头部信息
    const options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?' + query,
        method: 'GET'
    };
    const request = https.request(options, (response) => {
        const chunks = [];
        response.on('data', (chunk) => {
            chunks.push(chunk);
        });
        response.on('end', () => {
            const string = Buffer.concat(chunks).toString();
            const object = JSON.parse(string);
            if (object.error_code) {
                console.error(errorMap[object.error_code] || object.error_msg);
                // 退出当前进程，0 表示成功，这里使用 0 之外的数字
                process.exit(2);
            }
            else {
                object.trans_result.map(obj => {
                    console.log(obj.dst);
                });
                process.exit(0);
            }
        });
    });
    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
};
exports.translate = translate;
