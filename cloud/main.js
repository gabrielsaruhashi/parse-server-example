// Android push test
// To be used with:
// https://github.com/codepath/ParsePushNotificationExample
// See https://github.com/codepath/ParsePushNotificationExample/blob/master/app/src/main/java/com/test/MyCustomReceiver.java
Parse.Cloud.define('pushChannelTest', function(request, response) {

  // request has 2 parameters: params passed by the client and the authorized user
  var params = request.params;
  var user = request.user;

  var customData = params.customData;
  var title = params.title;
  var launch = params.launch;
  var broadcast = params.broadcast;
  var channel = params.channelID;
  var sender = params.senderID;
  var token = params.token;

  // use to custom tweak whatever payload you wish to send
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("channels", channel); // Set the channel
  pushQuery.notEqualTo("deviceToken", token) //do not notify the poster
  console.log(token);
  console.log(pushQuery.toString());

  var payload = {};

  if (customData) {
      payload.customdata = customData;
  }
  else if (launch) {
      payload.launch = launch;
  }
  else if (broadcast) {
      payload.broadcast = broadcast;
  }

  // Note that useMasterKey is necessary for Push notifications to succeed.

  Parse.Push.send({
  where: pushQuery,     // for sending to a specific channel
  data: {"action": "com.example.UPDATE_STATUS", "newsItem": title, "title": title, "alert": customData, "event_id": channel},
  }, { success: function() {
     console.log("#### PUSH OK");
  }, error: function(error) {
     console.log("#### PUSH ERROR" + error.message);
  }, useMasterKey: true});

  response.success('success');
});

Parse.Cloud.define('pushMemoryNotification', function(request, response) {
  var params = request.params;
  var user = request.user;

  var customData = params.customData;
  var eventId = params.eventId;

  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("channels", eventId);

  var payload = {};

  if (customData) {
      payload.customdata = customData;
  }

  Parse.Push.send({
  where: pushQuery,     // for sending to a specific channel
  data: {"action": "com.example.UPDATE_STATUS", "title": "Event Reminder", "alert": customData},
  }, { success: function() {
     console.log("#### PUSH OK");
  }, error: function(error) {
     console.log("#### PUSH ERROR" + error.message);
  }, useMasterKey: true});

  response.success('success');
});

Parse.Cloud.define('pushRecommendedEventNotification', function(request, response) {
  var params = request.params;
  var userId = params.userId;
  var friendName = params.friendName;

  var pushQuery = new Parse.Query(Parse.User);
  pushQuery.equalTo("id", userId);

  Parse.Push.send({
  where: pushQuery,     // for sending to a specific channel
  data: {"action": "com.example.UPDATE_STATUS",
  "title": "New event!",
  "alert": friendName + " has created an event you might be interested in. Check it out!"},
  }, { success: function() {
     console.log("#### PUSH OK");
  }, error: function(error) {
     console.log("#### PUSH ERROR" + error.message);
  }, useMasterKey: true});

  response.success('success');
});
