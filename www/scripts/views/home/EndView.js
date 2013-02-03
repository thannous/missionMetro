
define(['jquery','underscore', 'Backbone', 'text!templates/home/EndView.html'],
    function ($, _, Backbone, EndViewTemplate) {

        var EndView = Backbone.View.extend({

            events:{
                'click #btnBack':'btnBack_clickHandler',
                'click #validation': 'validation'
            },
            initialize: function(){


            },
            render:function () {
                this.$el.html(_.template(EndViewTemplate));




                var options = {

                    types: ['geocode'],
                    componentRestrictions: {country: 'fr'}
                };
               var autocomplete = new google.maps.places.Autocomplete(document.getElementById('input_end'), options);


                console.log("hello");

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
                    console.log("hello2");
                    google.maps.event.addListener(autocomplete, 'place_changed', function() {
                        place = autocomplete.getPlace();

                        var b = JSON.stringify(place);

                        localStorage.removeItem('end');
                        localStorage.setItem('end', b);
                        console.log(localStorage['end']);
                        $("#nend").text(place.name);
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
                            $("#nend").text(place.name);
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

        return EndView;
    });
