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

var faqdatabase = require("./faqdatabase");

for (var i = 0; i < process.argv.length; i++) {
    console.log("argv[" + i + "] = " + process.argv[i]);
}

var db_url = faqdatabase.db_url;

var database = faqdatabase.database;

console.log("creating cloudant designDoc ...");
var param = {};
param.url = db_url;
param.contentType = 'application/json';
var target_db = database[0];
faqdatabase.createDoc2(param, target_db, "_design/fb_docDesignDocV1", "./lib/cloudant_design/fb_doc.json").then(function(err, body) {
    console.log("create designDoc ok: " + target_db);
    target_db = database[1];
    return faqdatabase.createDoc2(param, target_db, "_design/login_userDesignDocV1", "./lib/cloudant_design/login_user.json");
}).then(function(err, body) {
    console.log("create designDoc ok: " + target_db);
    target_db = database[2];
    return faqdatabase.createDoc2(param, target_db, "_design/qa_docDesignDocV1", "./lib/cloudant_design/qa_doc.json");
}).then(function(err, body) {
    console.log("create designDoc ok: " + target_db);
}).catch(function(err, body) {
    console.log("create designDoc error: " + target_db);
});
