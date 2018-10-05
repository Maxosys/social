
/************************ Sign-UP for FaCeBOOK ********************************/

var YOUR_WEBSITE_URL = "http://localhost/";

function fb_signup() 
 { 

    FB.login(function(response) 
    {

        if (response.authResponse) {
        var token = $('input[name="_token"]').val();
        //var metaa = '<meta name="_token" content="{!! csrf_token() !!}"/>';
    
      $.ajaxSetup({
            headers: { 'X-CSRF-Token' : $('meta[name=_token]').attr('content') }
          });
          
            console.log('Welcome!  Fetching your information.... ');
         
            access_token  = response.authResponse.accessToken; //get access token
            user_id       = response.authResponse.userID; //get FB UID

         FB.api('/me?fields=name,email,birthday,first_name,last_name,gender,hometown,location', function(response) {
               
      console.log(response);        
      
      var fbid  = response.id;
      var email  = response.email;        
      var firstname  = response.first_name;
      var lastname  = response.last_name;
      var name  = response.name;
      var logintype   = 'facebook';

      
    $.post("register",{email:email,firstname:firstname,lastname:lastname,fbid:fbid,name:name,logintype:logintype}, function(resp){         
      console.log(resp);    
 
      if(resp==1)
      {       
        
        alert(email+" Already Registered");

        window.location.href= YOUR_WEBSITE_URL+"/register";
  
      }
      else if(resp==2)
      {
        alert("Email or Password is wrong !");
      }
      else if(resp==3)
      {
        window.location.href= YOUR_WEBSITE_URL;
      }
    
    
    });
         
          // you can store this data into your database             
            });

        } 
      else 
    {
            //user hit cancel button
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {
        scope: 'email'
    });
}

/************************Login With FaCeBOOK********************************/


function fb_signin()
 {  

    FB.login(function(response) {

        if (response.authResponse) {
       var token = $('input[name="_token"]').val();
    //var metaa = '<meta name="_token" content="{!! csrf_token() !!}"/>';
    
      $.ajaxSetup({
     
            headers: { 'X-CSRF-Token' : $('meta[name=_token]').attr('content') }
          });
          
            console.log('Welcome!  Fetching your information.... ');
            //console.log(response); // dump complete info
            access_token = response.authResponse.accessToken; //get access token
            user_id = response.authResponse.userID; //get FB UID

         FB.api('/me?fields=name,email,birthday,first_name,last_name,gender,hometown,location', function(response) {
               
      console.log(response);        
      
      var fbid  = response.id;
      var email  = response.email;        
      var firstname  = response.first_name;
      var lastname  = response.last_name;
      var name  = response.name;
      var logintype   = 'facebook';

      
    $.post("login",{email:email,firstname:firstname,lastname:lastname,fbid:fbid,name:name,logintype:logintype}, function(resp){
           console.log(resp);    
       
        if(resp==1)
        {    
          alert("Please register with FB");
           window.location.href= YOUR_WEBSITE_URL+"register";  
        }
        else if(resp==2)
        {
            alert("Email or Password is wrong !");
        }
        else if(resp==3)
        {
          window.location.href= YOUR_WEBSITE_URL;
        }   
    
    });       
        
          // you can store this data into your database             
            });

        } 
      else 
    {
            //user hit cancel button
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {
        scope: 'email'
    });
}

