var mongoose = require('mongoose');
const notifications=require('./notification.schema');
module.exports = function(options){
console.log(options.mongoUrl);
mongoose.connect(options.mongoUrl);
var db = mongoose.connection;
var seneca = require('seneca');
var notificationClient = seneca();
this.add('role:notification,cmd:getAllNotification', function(msg, respond) {
    console.log("======Notification Service============================");
    console.log(msg);
    var targetID=msg.username;

   return  notifications.find( {NotificationTargetId:targetID}).sort({DateAndTime: -1}).exec(function(err,data){
if(err) { return respond(err); }
      if(data.length === 0) 
      { return respond(null,{response:'no data found'});
  }
      else{
      return respond(null,{msg:data});
      console.log(msg.data);
      }
  });

    });
this.add('role:notification,cmd:getAllNotifications', function(msg, respond) {
    console.log("======Notification Service Menu============================");
    console.log(msg.NotificationData.username);
     console.log(msg.NotificationData.Id);
    var username=msg.NotificationData.username;
    var id=msg.NotificationData.Id;
    console.log(id);
     // return respond(null,{msg:'data'});
     // db.notifications.find({$and:[{NotificationId:2},{NotificationTargetId:"spsingh559"}]}).pretty()
if(id==true||id==false){
    return  notifications.find( {$and:[{NotificationStatus:id},{NotificationTargetId:username}]}).exec(function(err,data){
if(err) { return
console.log("error in getAllNotifications");
 respond(err); }
      if(data.length === 0) 
      { return respond(null,{response:'no data found'});
  }
      else{
      return respond(null,{msg:data});
      console.log(msg.data); }
  });
  }
  else{
    return  notifications.find( {$and:[{NotificationId:id},{NotificationTargetId:username}]}).exec(function(err,data){
if(err) { return
console.log("error in getAllNotifications");
 respond(err); }
      if(data.length === 0) 
      { return respond(null,{response:'no data found'});
  }
      else{
      return respond(null,{msg:data});
      console.log(msg.data); }
  });
  }
  });

this.add('role:notification,cmd:update', function(msg, respond) {
    console.log("======Notification Service update============================"+msg);

    var objectid=msg.id;
    console.log("=========object id in update microservice is"+ objectid);
    console.log("=========NotificationStatus id in update microservice is"+ msg.updateOBj.NotificationStatus);
var NotificationStatus=msg.updateOBj.NotificationStatus;
var notificationStatustext=msg.updateOBj.notificationStatustext;
var notificationResultStatus=msg.updateOBj.notificationResultStatus;
   return notifications.findOneAndUpdate({_id:objectid},
                 {$set:{NotificationStatus:msg.updateOBj.NotificationStatus,
                         notificationStatustext:msg.updateOBj.notificationStatustext,
                         notificationResultStatus:msg.updateOBj.notificationResultStatus
                 }},function(err, data){
               if(err){return
console.log("error in getAllNotifications");
 respond(err); }else{
        console.log('-----------------------data updated-------------------');
        console.log(data);
         return respond(null,{msg:data});
      
    }
           });

    });


this.add('role:lobby,action:addPlayer', function(msg, respond) {
    console.log("======Notification Service Add Lobby============================"+msg);

   
   return notifications.findOneAndUpdate({NotificationId:msg.NotificationId},
                 {$set:{NotificationTypeId:msg.NotificationTypeId,
                         NotificationOwnerId:msg.NotificationOwnerId,
                         NotificationTargetId:msg. NotificationTargetId
                 }},function(err, data){
               if(err){return
console.log("error in getAllNotifications");
 respond(err); }else{
        console.log('-----------------------data updated-------------------');
        console.log(data);
         return respond(null,{msg:data});
      
    }
           });

    });

}






 
