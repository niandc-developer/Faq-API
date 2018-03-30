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

// update admin.json
var adminFile = "./lib/cloudant_data/admin.json";
var adminKey = "admin";
if (faqdatabase.FAQ_ADMIN_USERNAME || faqdatabase.FAQ_ADMIN_PASSWORD) {
    faqdatabase.readFile(adminFile, function(data) {
        var admin = JSON.parse(data);

        if (faqdatabase.FAQ_ADMIN_USERNAME) {
            admin['_id'] = faqdatabase.FAQ_ADMIN_USERNAME;
            admin['userid'] = admin['_id'];

            adminKey = admin['_id'];
        }

        if (faqdatabase.FAQ_ADMIN_PASSWORD) {
            admin['password'] = faqdatabase.FAQ_ADMIN_PASSWORD;
        }

        admin['create_date'] = faqdatabase.formatDate(new Date(faqdatabase.currentDate()));

        faqdatabase.writeFile(adminFile, JSON.stringify(admin, null, '\t'), function(err) {
            if (err) {
                console.log('update file error: '+ adminFile);
            } else {
                console.log('update file ok: '+ adminFile);
            }
        });
    });
}

var db_url = faqdatabase.db_url;
var database = faqdatabase.database;

console.log("creating cloudant initialData ...");
var param = {};
param.url = db_url;
param.contentType = 'application/json';
faqdatabase.createDoc2(param, database[1], adminKey, adminFile).then(function(err, body) {
    console.log("create initialData ok: " + database[1]);
}).catch(function(err, body) {
    console.log("create initialData error: " + database[1]);
});
