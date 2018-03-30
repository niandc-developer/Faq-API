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

var db_url = faqdatabase.apicount_url;

var database = faqdatabase.apicount_database;

console.log("creating cloudant database ...");
database.forEach(function(db) {
    var param0 = {};
    param0.url = db_url + "/" + db;
    param0.contentType = 'application/json';
    faqdatabase.put2(param0).then(function(body) {
        console.log("create database ok: " + db);

        console.log("creating cloudant designDoc ...");
        var param = {};
        param.url = db_url;
        param.contentType = 'application/json';
        var target_db = database[0];
        faqdatabase.createDoc2(param, target_db, "_design/api_counterDesignDocV1", "./lib/cloudant_design/api_counter.json").then(function(err, body) {
          console.log("create designDoc ok: " + target_db);
        }).catch(function(err, body) {
          console.log("create designDoc error: " + target_db);
        });

    }).catch(function(err) {
        console.log("create database error: " + db);

    });
});
