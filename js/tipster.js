
var timeNow = new Date().getTime();
timeNow = timeNow * 0.001;
timeNow = Math.floor(timeNow);
$.ajax({
    type: "GET",
    url :"http://api.betadvisor.com/user/tipster/list",
    data: {
                    
        "time": timeNow
    },
    success: function(init, textStatus, jqXHR) {
                
        var obj = $.parseJSON(init);
        var  items = obj.data.items;
        $.each(items, function(i, val) {
                 
                 console.log(i);
                 console.log(val);
            var html = "<li class='ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c'><div class='ui-btn-inner ui-li'><div class='ui-btn-text'><a class='ui-link-inherit' href='#tipsprofile'><p class='ui-li-aside'><span class='price'>"+ Math.floor(val.sfGuardUser.Packs[0].Pack.Offers[0].price_ttc_eur) + " €</span><br /><span class='mois'>/month</span></p><div class='text'><img src='../image/graph.png' width='30'/><div class='title'><span class='stars three-stars'></span><h2 class='ui-li-heading'>" + val.scene_name +"</h2><p class='ui-li-desc'>Profit :<span class='green'>" + val.sfGuardUser.LiveStats[0].profit_180d +"</span></p><p class='ui-li-desc'>Yield :"+ val.sfGuardUser.LiveStats[0].yield_180d + " %</br></div></div><div class='clear'></div></a></div><span class='ui-icon ui-icon-arrow-r ui-icon-shadow'> </span></div></li>"
            console.log(html);
            $("#listviewTister").append(html);
        });
                
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
    }
});
  
