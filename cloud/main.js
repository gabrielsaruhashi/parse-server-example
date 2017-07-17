// Android push test
// To be used with:
// https://github.com/codepath/ParsePushNotificationExample
// See https://github.com/codepath/ParsePushNotificationExample/blob/master/app/src/main/java/com/test/MyCustomReceiver.java
Parse.masterKey = 'myMasterKey';

Parse.Cloud.define('pushChannelTest', function(request, response) {

  // request has 2 parameters: params passed by the client and the authorized user
  var params = request.params;
  var user = request.user;

  var customData = params.customData;
  var launch = params.launch;
  var broadcast = params.broadcast;

  // use to custom tweak whatever payload you wish to send
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("deviceType", "android");

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
  where: pushQuery,      // for sending to a specific channel
  data: payload,
  }, { success: function() {
     console.log("#### PUSH OK");
  }, error: function(error) {
     console.log("#### PUSH ERROR" + error.message);
  }, useMasterKey: true});

  response.success('success');
});

Parse.Cloud.define("sendAnnouncement", function(request, response) {
        var name = request.params.senderName;
        var msg = request.params.message;

        Parse.Push.send({
                channels: [ request.params.accountId ],
                data: {
                        title: name,
                        message: msg,
                        action: "com.hello.announcement.sample.SEND_ANNOUNCEMENT",
                        senderId: request.params.senderId,
                        accountId: request.params.accountId
                }
        }, {
                success: function() {
                        // Push was successful
                        response.success("sendAnnouncement sent");
                },
                error: function(error) {
                        // Handle error
                        response.error("error with sendAnnouncement: " + error);
                },
                useMasterKey: true
        });
});

