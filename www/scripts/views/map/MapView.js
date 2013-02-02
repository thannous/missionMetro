
define(['jquery','underscore', 'Backbone', 'text!templates/map/MapView.html'],
    function ($, _, Backbone, MapViewTemplate) {

        var MapView = Backbone.View.extend({

            events:{
                'click #btnBack':'btnBack_clickHandler'
            },
            initialize: function(){


            },
            render:function () {
                this.$el.html(_.template(MapViewTemplate));
                var options = { maximumAge: 3000, enableHighAccuracy: true }
                watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
                function onSuccess(position) {
                    var element = document.getElementById('geolocation');
                    element.innerHTML = 'Latitude : ' + position.coords.latitude + '<br/>' +
                        'Longitude : ' + position.coords.longitude + '<br/>' +
                        'Altitude : ' + position.coords.altitude + '<br/>' +
                        'Précision : '               + position.coords.accuracy          + '<br/>' +

                    'Direction : '               + position.coords.heading           + '<br/>' +
                        'Vitesse : '                 + position.coords.speed             + '<br/>' +
                    'Date :'            + new Date(position.timestamp)      + '\n';
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
                    showDirection("paris", "amiens", map)

                }

                function onError(error) {
                    alert('code : '    + error.code    + '\n' +
                        'message : ' + error.message + '\n');
                }


                function showDirection(orgn, dstntn, map)
                {
                    var directionsService = new google.maps.DirectionsService();
                    var directionsDisplay = new google.maps.DirectionsRenderer();



                    directionsDisplay.setMap(map);
                    directionsDisplay.setPanel(document.getElementById('displayDirections'));

                    var request = {
                        origin : orgn,
                        destination : dstntn,
                        travelMode : google.maps.DirectionsTravelMode.WALKING,

                        region: "fr"
                    };

                    directionsService.route(request, function(response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                        }
                    });
                    var win = function(position) {
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;
                        var myLatlng = new google.maps.LatLng(lat, long);

                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: map

                        });

                        marker.setMap(map);
                        marker.setMap(map);

                        var bounds = new google.maps.LatLngBounds();
                        bounds.extend(orgn);
                        bounds.extend(dstntn);
                        bounds.extend(myLatlng);
                        map.fitBounds(bounds);
                    };

                    var fail = function(e) {
                        alert('Can\'t retrieve position.\nError: ' + e);
                    };

                    var watchID = navigator.geolocation.getCurrentPosition(win, fail);
                }
                return this;

            },


            btnBack_clickHandler:function (event) {
                $.mobile.jqmNavigator.popView();
            }

        });

        return MapView;
    });