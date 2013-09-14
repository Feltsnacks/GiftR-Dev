var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('giftr', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'giftr' database");
        db.collection('lists', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'lists' collection doesn't exist. Creating it with sample data...");
               populateDB();
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving list: ' + id);
    db.collection('lists', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    console.log('Retrieving lists');
    db.collection('lists', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.add = function(req, res) {
    var list = req.body;
    console.log('Adding list: ' + JSON.stringify(list));
    db.collection('lists', function(err, collection) {
        collection.insert(list, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.update = function(req, res) {
    var id = req.params.id;
    var user = req.body;
    console.log('Updating list: ' + id);
    console.log(JSON.stringify(user));
        db.collection('lists', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, list, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
    });
}
 
exports.del = function(req, res) {
    var id = req.params.id;
    console.log('Deleting list: ' + id);
    db.collection('lists', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.

var populateDB = function() {
 
    var lists = [
    {
        name: "My secret list",
        userid: "523447ab19d711803f000002"
    },
    {
        name: "Til bryllupet",
        userid: "523447ab19d711803f000002"
    },
    {
        name: "Ønskeliste 1",
        userid: "523447ab19d711803f000001"
    },
    {
        name: "Ønskeliste 2",
        userid: "523447ab19d711803f000001"
    }];
 
    db.collection('lists', function(err, collection) {
        collection.insert(lists, {safe:true}, function(err, result) {});
    });
 
};