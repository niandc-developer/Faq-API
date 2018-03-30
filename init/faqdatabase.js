/**
 * Copyright 2018 Nippon Information and Communication. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fs = require('fs');
var request = require('request');

var db_url, apicount_url;
if (process.env.VCAP_SERVICES) {
    var VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES);
    for (var i=0; i < VCAP_SERVICES.cloudantNoSQLDB.length; i++) {
        if (~VCAP_SERVICES.cloudantNoSQLDB[i].name.indexOf('faqap')) {
            db_url = VCAP_SERVICES.cloudantNoSQLDB[i].credentials.url;
        }
        if (~VCAP_SERVICES.cloudantNoSQLDB[i].name.indexOf('faqdb')) {
            apicount_url = VCAP_SERVICES.cloudantNoSQLDB[i].credentials.url;
        }
    }

} else {
    apicount_url = "error";
    db_url = "error";
}
exports.apicount_url = apicount_url;
exports.db_url = db_url;

if (process.env.FAQ_ADMIN_USERNAME) {
    exports.FAQ_ADMIN_USERNAME = process.env.FAQ_ADMIN_USERNAME;
}
if (process.env.FAQ_ADMIN_PASSWORD) {
    exports.FAQ_ADMIN_PASSWORD = process.env.FAQ_ADMIN_PASSWORD;
}

exports.database = ["fb_doc", "login_user", "qa_doc"];
exports.apicount_database = ["api_counter"];

exports.put2 = put2;
exports.createDoc2 = createDoc2;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.formatDate = formatDate;
exports.currentDate = currentDate;

function get(param, callback) {
    var myUrl = param.url;
    var options = {
        url: myUrl,
        headers: {
            'Content-Type': param.contentType
        },
        json: true,
        body: null
    };
    request.get(options, function(err, response, body) {
        callback(err, response, body);
    });
}

function post(param, callback) {
    var myUrl = param.url;
    var options = {
        url: myUrl,
        headers: {
            'Content-Type': param.contentType
        },
        json: true,
        body: param.body
    };
    request.post(options, function(err, response, body) {
        callback(err, response, body);
    });
}

function put2(param) {
    return new Promise(function(resolve, reject) {
        var myUrl = param.url;
        var options = {
            url: myUrl,
            headers: {
                'Content-Type': param.contentType
            },
            body: param.body
        };
        request.put(options, function(err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function readFile(file, callback) {
    fs.readFile(file, 'utf8', function(err, text) {
        callback(text);
    });
}

function writeFile(file, data, callback) {
    fs.writeFile(file, data, function(err) {
        callback(err);
    });
}

function createDoc2(param, db, doc, filepath) {
    return new Promise(function(resolve, reject) {
        var org_url = param.url;
        var param1 = {};
        param1.url = org_url + '/' + db + '/' + doc;
        param1.contentType = "application/json";
        get(param1, function(err, response, body) {
            if (err) {
                reject(err, null);
            } else {
                if (body.error) {
                    readFile(filepath, function(data) {
                        var obj = JSON.parse(data);
                        var param2 = {};
                        param2.url = org_url + '/' + db;
                        param2.contentType = "application/json";
                        param2.body = obj;
                        post(param2, function(err, response, body) {
                            if (err) {
                                reject(err, null);
                            } else {
                                resolve(null, body);
                            }
                        });
                    });
                } else {
                    resolve(null, body);
                }
            }
        });
    });
}

function formatDate(date, format) {
    if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    if (format.match(/S/g)) {
        var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        var length = format.match(/S/g).length;
        for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
    }
    return format;
}

function currentDate() {
    var date = new Date();
    var jisa = 9;
    var here= date.getTime();
    var gmt = here + date.getTimezoneOffset()*60*1000;

    var dateMili = gmt+jisa*60*60*1000;
    return dateMili;
}
