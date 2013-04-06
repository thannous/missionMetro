
define(['jquery','underscore', 'Backbone', 'text!templates/home/StartView.html'],
    function ($, _, Backbone, StartViewTemplate) {

        var StartView = Backbone.View.extend({

            events:{
                'click #btnBack':'btnBack_clickHandler',
                'click #validation': 'validation'
            },
            initialize: function(){

            this.start = null;

            },
            render:function () {
                this.$el.html(_.template(StartViewTemplate));

				var head = $ (".ui-page-active [data-role='header']"),
					foot = $ (".ui-page-active [data-role='footer']"),
					headerheight = head.outerHeight ();
				$.mobile.window.on ("throttledresize", function () {
					$ ("#start-sorter").height ($.mobile.window.height () - headerheight - 20).css ("top", headerheight + 18);
				});
				$ ("#start-sorter").height ($.mobile.window.height () - headerheight - 20).css ("top", headerheight + 18);
				$.mobile.window.scroll (function (e) {
					var headTop = $ (window).scrollTop ();
					if (headTop < headerheight && headTop > 0) {
						$ ("#start-sorter").css ({
							"top": headerheight + 15 - headTop,
							"height": $.mobile.window.height () - headerheight - 20
						});
					} else if (headTop >= headerheight && headTop > 0 && parseInt (headTop + $.mobile.window.height ()) < parseInt (foot.offset ().top)) {
						$ ("#start-sorter").css ({
							"top": "15px",
							"height": $.mobile.window.height ()
						});
						$ ("#start-sorter li").height ("3.7%");
					} else if (parseInt (headTop + $.mobile.window.height ()) >= parseInt (foot.offset ().top) && parseInt (headTop + $.mobile.window.height ()) <= parseInt (foot.offset ().top) + foot.height ()) {
						$ ("#start-sorter").css ({
							"top": "15px",
							"height": $.mobile.window.height () - ( parseInt (headTop + $.mobile.window.height ()) - parseInt (foot.offset ().top) + 8 )
						});
					} else if (parseInt (headTop + $.mobile.window.height ()) >= parseInt (foot.offset ().top)) {
						$ ("#start-sorter").css ({
							"top": "15px"
						});
					} else {
						$ ("#start-sorter").css ("top", headerheight + 15);
					}
				});
				$ ("#start-sorter li").click (function () {
					console.log ("je click")
					var top,
						letter = $ (this).text (),
						divider = $ ("#start-sortedList").find ("li.ui-li-divider:contains(" + letter + ")");
					console.log (divider.length)
					if (divider.length > 0) {
						top = divider.offset ().top;
						console.log (top)
						$.mobile.silentScroll (top);
					} else {
						return false;
					}
				});

				$ ("#sorter li").hover (function () {
					$ (this).addClass ("ui-btn-up-b").removeClass ("ui-btn-up-c");
				}, function () {
					$ (this).removeClass ("ui-btn-up-b").addClass ("ui-btn-up-c");
				});

                    console.log("hello");

                    var options = {

                        types: ['geocode'],
                        componentRestrictions: {country: 'fr'}
                    };
               var autocomplete = new google.maps.places.Autocomplete(document.getElementById('start-input_start'), options);
                var options = { maximumAge: 3000, enableHighAccuracy: true }
                watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
                function onSuccess(position) {
                    var element = document.getElementById('geolocation');

                    this.config = {
                        latitude  : position.coords.latitude,
                        longitude : position.coords.longitude,
                        location  : 'Paris, Ile de France, France'
                    };

                    var mapOptions = {
                        zoom: 13,
                        center: new google.maps.LatLng(this.config.latitude, this.config.longitude),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }

                    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                    var latlng = new google.maps.LatLng(this.config.latitude, this.config.longitude);
                    var mark = new google.maps.Marker({
                        position: latlng,
                        map:      map,
                        title:    this.config.location,
                        animation: google.maps.Animation.DROP
                    });
                    google.maps.event.addListener(autocomplete, 'place_changed', function() {
                        place = autocomplete.getPlace();
                       var detail =  $.ajax("http://192.168.2.70:8080/MetroServer/trajet?lata=48.84327&lona=2.3324&latb=48.80234&lonb=2.51432432");
                      console.log(detail);
                        var lat = place.geometry.location.Ya;
                        var lng = place.geometry.location.Za;

                        var station = $.ajax("http://176.31.126.197:8080/metroserver/rest/ws/converting?lat="+lat+"&lon="+lng );
                        station.done(function(msg) {
                            test = JSON.parse(msg);
                            var station1 = JSON.stringify(msg);

                            $('.iStart').attr('src','img/metro/M_'+ test.ligne +'.png');

                            localStorage.removeItem("startStation");
                            localStorage.setItem("startStation", station1);
                            console.log( station1);
                        });
                        station.fail(function(jqXHR, textStatus) {
                            alert( "Request failed: " + textStatus );
                        });
                        var start = JSON.stringify(place);
                        localStorage.removeItem('start');
                        localStorage.setItem('start', start);
                        $("#nstart").text(place.name);
                        if (place.geometry.viewport) {
                            map.fitBounds(place.geometry.viewport);
                        } else {
                            map.setCenter(place.geometry.location);

                            var mark = new google.maps.Marker({
                                position: place.geometry.location,
                                map:      map,
                                title:    "depart",
                                animation: google.maps.Animation.DROP
                            });

                            var infowindow = new google.maps.InfoWindow();

                            infowindow.setContent(place.name);
                            infowindow.open(map, mark);

                            var bounds = new google.maps.LatLngBounds();

                            bounds.extend(place.geometry.location);
                            bounds.extend(latlng);
                            map.fitBounds(bounds);

                        }
                    });


                }

                function onError(error) {
                    alert('code : '    + error.code    + '\n' +
                        'message : ' + error.message + '\n');
                }


                return this;

            },
            btnBack_clickHandler:function (event) {
                $.mobile.jqmNavigator.popView();
            },
            validation : function (event){
                $.mobile.jqmNavigator.popView();
            }

        });

        return StartView;
    });
