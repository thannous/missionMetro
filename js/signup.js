      $("#btnsignup").bind("click", function(){
         var email = $('#email').val();
        var password = $('#password').val();
         if(password == '' || email == '') {
            alert('Les champs doivent êtres remplis');
        } else {
            var timeNow = new Date().getTime();
            timeNow = timeNow * 0.001;
            timeNow = Math.floor(timeNow);
            $.ajax({
                type: "GET",
                url :"http://api.betadvisor.com/user/account/register_init",
                data: {
                    
                    "time": timeNow
                },
                success: function(init, textStatus, jqXHR) {
                console.log(init);
                var obj = $.parseJSON(init);
                    $.ajax({
                        type: "POST",
                        url :"http://api.betadvisor.com/user/account/register_simple",
                        data: {
                            "username": email,
                            "password_hash": $.sha1(obj.data.salt + password),
                            "nonce": obj.data.nonce,
                            "time": timeNow
                        },
                        success: function(data, textStatus, jqXHR) {
                        console.log(data);
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                        console.log(textStatus);
                        }
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                }
            });
        }
    });
