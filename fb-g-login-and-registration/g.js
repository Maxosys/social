/* GOOGLE SIGN UP 

<script src="https://apis.google.com/js/client:platform.js" async defer></script>
<link type="text/css" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">

*/
  
  var CLIENT_URL = 'googleusercontent.com';
  var YOUR_WEBSITE_URL = "http://localhost/";
  
  
  var auth2 = auth2 || {};

  (function() {
    var po = document.createElement('script');
    po.type = 'text/javascript'; po.async = true;
    po.src = 'https://plus.google.com/js/client:plusone.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
  })();

  var helper = (function() {
  var authResult = undefined;

  return {
    /**
     * Hides the sign-in button and connects the server-side app after
     * the user successfully signs in.
     *
     * @param {Object} authResult An Object which contains the access token and
     *   other authentication information.
     */
    onSignInCallback: function(authResult) {
      $('#authResult').html('Auth Result:<br/>');
      for (var field in authResult) {
        $('#authResult').append(' ' + field + ': ' + authResult[field] + '<br/>');
      }
      if (authResult['access_token']) {
        // The user is signed in
        this.authResult = authResult;

        // After we load the Google+ API, render the profile data from Google+.
        gapi.client.load('plus','v1',this.renderProfile);

        // After we load the profile, retrieve the list of activities visible
        // to this app, server-side.
        helper.activities();
      } else if (authResult['error']) {
        // There was an error, which means the user is not signed in.
        // As an example, you can troubleshoot by writing to the console:
        console.log('There was an error: ' + authResult['error']);
        $('#authResult').append('Logged out');
        $('#authOps').hide('slow');
        $('#gConnect').show();
      }
      console.log('authResult', authResult);
    },
    /**
     * Retrieves and renders the authenticated user's Google+ profile.
     */
    renderProfile: function() {
      var request = gapi.client.plus.people.get( {'userId' : 'me'} );
    
      request.execute(function(profile)    
      {
		console.log(profile);
       
          var googleId    =  profile['id'];
          var fullname    =  profile['displayName'];
          var firstname   =  profile['name']['givenName'];
          var lastname    =  profile['name']['familyName'];
          var gender      =  profile['gender'];
          var emails      =  profile['emails'][0]['value'];

          
          var gimage      =  profile['image']['url'];          
          var logintype   = "google";
       
              $.ajax({
             beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
             url:"register",
              type:"POST",
           data:{
                 googleId : googleId,
                 fullname : fullname,
                 firstname : firstname,
                 lastname : lastname,
                 logintype : logintype,
                 gender : gender,
                 emails : emails,
                 gimage : gimage
             
                },
          success:function(resp)
          {

            console.log(resp);

              if(resp==1)
              {       
                alert(emails+" Already Registered");
                    
              }
              else if(resp==2)
              {
                alert("Email or Password is wrong !");
              }
              else if(resp==3)
              {
                console.log("Correct");
                window.location.href= YOUR_WEBSITE_URL;
              }
          }
        
        
        
        });
        
        });
     
    },
    /**
     * Calls the server endpoint to disconnect the app for the user.
     */
    disconnectServer: function() {
      // Revoke the server tokens
      $.ajax({
        type: 'POST',
        url: base_url + 'disconnect',
        async: false,
        success: function(result) {
          console.log('revoke response: ' + result);
          $('#authOps').hide();
          $('#profile').empty();
          $('#visiblePeople').empty();
          $('#authResult').empty();
          $('#gConnect').show();
        },
        error: function(e) {
          console.log(e);
        }
      });
    },
    /**
     * Calls the server endpoint to connect the app for the user. The client
     * sends the one-time authorization code to the server and the server
     * exchanges the code for its own tokens to use for offline API access.
     * For more information, see:
     *   https://developers.google.com/+/web/signin/server-side-flow
     */
    connectServer: function(code) {
      console.log(code);
      $.ajax({
        type: 'POST',
        url: base_url + 'connect?state={{ STATE }}',
        contentType: 'application/octet-stream; charset=utf-8',
        success: function(result) {
          console.log(result);
          helper.activities();
          onSignInCallback(auth2.currentUser.get().getAuthResponse());
        },
        processData: false,
        data: code
      });
    },
    /**
     * Calls the server endpoint to get the list of activities visible to this
     * app.
     * @param success Callback called on success.
     * @param failure Callback called on error.
     */
    activities: function(success, failure) {
      success = success || function(result) { helper.appendActivity(result); };
      $.ajax({
        type: 'GET',
        url: base_url + 'activities',
        contentType: 'application/octet-stream; charset=utf-8',
        success: success,
        error: failure,
        processData: false
      });
    },
    /**
     * Displays visible People retrieved from server.
     *
     * @param {Object} activities A list of Google+ activity resources.
     */
    appendActivity: function(activities) {
      $('#activities').empty();

      $('#activities').append('Number of activities retrieved: ' +
          activities.items.length + '<br/>');
      for (var activityIndex in activities.items) {
        activity = activities.items[activityIndex];
        $('#activities').append('<hr>' + activity.object.content + '<br/>');
      }
    },
  };
})();

/**
 * Perform jQuery initialization and check to ensure that you updated your
 * client ID.
 */
$(document).ready(function() {
  $('#disconnect').click(helper.disconnectServer);
  if ($('[data-clientid="'+CLIENT_URL+'"]').length > 0) { 
    alert('This sample requires your OAuth credentials (client ID) ' +
        'from the Google APIs console:\n' +
        '    https://code.google.com/apis/console/#:access\n\n' +
        'Find and replace YOUR_CLIENT_ID with your client ID and ' +
        'YOUR_CLIENT_SECRET with your client secret in the project sources.'
    );
  }
});

/**
 * Called after the Google client library has loaded.
 */
function startApp() {
  gapi.load('auth2', function(){ 

    // Retrieve the singleton for the GoogleAuth library and setup the client.
    gapi.auth2.init({
        client_id: CLIENT_URL,      
        cookiepolicy: 'single_host_origin',
        fetch_basic_profile: false,
        scope: 'profile email'
      }).then(function (){
            console.log('init');
            auth2 = gapi.auth2.getAuthInstance();
            auth2.grantOfflineAccess(); 
            auth2.then(function() {
                var isAuthedCallback = function () {
                  onSignInCallback(auth2.currentUser.get().getAuthResponse())
                }
                helper.activities(isAuthedCallback);
              });
          });
  });
}

/**
 * Either signs the user in or authorizes the back-end.
 */
function signInClick() {
  startApp();
  var signIn = function(result) {
      auth2.signIn().then(
        function(googleUser) {
          onSignInCallback(googleUser.getAuthResponse());
        }, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
    };

  var reauthorize = function() {
      auth2.grantOfflineAccess().then(
        function(result){
          helper.connectServer(result.code);
        });
    };

  helper.activities(signIn, reauthorize);
}


function googleloginClick() {
  startApp();
  var signIn = function(result) {
      auth2.signIn().then(
        function(googleUser) {
          onSignInCallback(googleUser.getAuthResponse());
        }, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
    };

  var reauthorize = function() {
      auth2.grantOfflineAccess().then(
        function(result){
          helper.connectServer(result.code);
        });
    };

  helper.activities(signIn, reauthorize);
}

/**
 * Calls the helper method that handles the authentication flow.
 *
 * @param {Object} authResult An Object which contains the access token and
 *   other authentication information.
 */
function onSignInCallback(authResult) {
  helper.onSignInCallback(authResult);
}