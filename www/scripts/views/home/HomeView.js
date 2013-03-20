define(['jquery', 'underscore', 'Backbone', 'views/map/MapView', 'views/home/StartView', 'views/home/EndView','moment', 'text!templates/home/HomeView.html'],
    function ($, _, Backbone, MapView, StartView, EndView, moment, HomeViewTemplate) {
        var HomeView = Backbone.View.extend({

            events: {
                'click #btnMapView': 'btnMapView_clickHandler',
                'click #nstart': 'start',
                'click #nend': 'end',
                'click #start_alarm': 'start_alarm'

            },

            render: function () {
                this.$el.html(_.template(HomeViewTemplate));
                var that = this;
                var options = {

                    types: ['geocode'],
                    componentRestrictions: {country: 'fr'}
                };
                watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
                function onSuccess(position) {
                    var element = document.getElementById('geolocation');

                    that.config = {
                        latitude  : position.coords.latitude,
                        longitude : position.coords.longitude,
                        location  : 'Paris, Ile de France, France'
                    };
                    var station = $.ajax("http://176.31.126.197:8080/metroserver/rest/ws/converting?lat1="+that.config.latitude+"&lon1="+that.config.longitude );
                    station.error(function(msg) {

                        ;
                        var msg =
                        {
                            "ligne":
                                [
                                ],
                            "name": "Le Bourget",
                            "loc":
                            {
                                "lon": 2.42587143446615,
                                "lat": 48.9308927557322
                            }
                        }

                        var trajet = {
                            "duration": 2580,
                            "steps": [
                                {
                                    "time": "00:29",
                                    "direction": "GARE DE MASSY PALAISEAU",
                                    "name": "GARE DU BOURGET, Le Bourget",
                                    "line": [
                                        "RER",
                                        "B"
                                    ],
                                    "type": "departure"
                                },
                                {
                                    "time": "00:40",
                                    "name": "GARE DU NORD RER, Paris",
                                    "wait": 240,
                                    "type": "step",
                                    "walk": 180
                                },
                                {
                                    "time": "00:47",
                                    "direction": "HAUSSMANN ST LAZARE",
                                    "name": "MAGENTA, Paris",
                                    "line": [
                                        "RER",
                                        "E"
                                    ],
                                    "type": "step"
                                },
                                {
                                    "time": "00:51",
                                    "name": "HAUSSMANN ST LAZARE, Paris",
                                    "wait": 180,
                                    "type": "step",
                                    "walk": 240
                                },
                                {
                                    "time": "00:58",
                                    "direction": "ST DENIS UNIVERSITE",
                                    "name": "Saint-Lazare, Paris",
                                    "line": [
                                        "Metro",
                                        "13"
                                    ],
                                    "type": "step"
                                },
                                {
                                    "time": "01:08",
                                    "name": "Mairie de Saint-Ouen",
                                    "wait": null,
                                    "type": "step",
                                    "walk": 240
                                },
                                {
                                    "time": "01:12",
                                    "direction": null,
                                    "name": "College Jean Jaures, Saint-Ouen",
                                    "line": null,
                                    "type": "arrival"
                                }
                            ],
                            "type": "Trajet arrivée au plus tôt"
                        }
                        // 0h51 = 3060 sec - 13h12 = 720 + 468800 = 44 460 sec



                        var steps = trajet.steps
                        var realTime;
                        for (var i = 0; i < steps.length; i++){
                            if(steps[i].type == "departure"){
                                var timeDepart = (moment(steps[i].time,"HH:mm"))
                                var timeDepartS = timeDepart.hours() * 3600 + timeDepart.minutes() * 60
                                var timeNowS = ((moment().hours()) * 3600 + (moment().minutes())*60)
                                if (timeNowS - timeDepartS > 0){
                                    realTime = (24 * 3600) - timeNowS - timeDepartS
                                }else
                                    realTime = timeDepartS - timeNowS;

                                var secondes = "00"
                                var minutes = (realTime / 60) % 60
                                var heures = Math.floor(realTime/3600)
                                if(heures < 10)
                                    heures = "0"+heures
                                console.log(realTime)
                                console.log(heures+":"+minutes+":"+secondes)
                                $('#counter').countdown({
                                    stepTime: 60,

                                    format: 'hh:mm:ss',
                                    startTime: heures+":"+minutes+":"+secondes,

                                    digitImages: 6,
                                    digitWidth: 30,
                                    digitHeight: 64,
                                    image: "img/digits.png"
                                });
                            }
                            if(steps[i].type == "arrival"){
                                $("#nend").text(steps[i].name);
                            }
                            console.log( steps[i].name + " " + steps[i].line  + "");
                        }
                        console.log(trajet)

                        var station1 = JSON.stringify(msg)
                        $("#nstart").text(msg.name);

                        $('.iStart').attr('src','img/metro/M_'+ msg.ligne +'.png');

                        localStorage.removeItem("startStation");
                        localStorage.setItem("startStation", station1);
                        console.log(station1);
                    });
                    station.done(function(jqXHR, textStatus) {
                        alert( "Request failed: " + textStatus );
                    });
                }
                function onError(error) {
                    alert('code : '    + error.code    + '\n' +
                        'message : ' + error.message + '\n');
                }

                if (window.localStorage.getItem('start')) {
                    var p = window.localStorage.getItem('start');
                    var depart = JSON.parse(p);
                    console.log(depart);
                    var q = window.localStorage.getItem('end');
                    var arriver = JSON.parse(q);

                    console.log(q);
                    var numStationStart = JSON.parse(window.localStorage.getItem('startStation'));

                    var numStationEnd = JSON.parse(window.localStorage.getItem('endStation'));

                    if (depart && arriver) {

                        $("#nstart").text(depart.name);
                        $("#nend").text(arriver.name);
                        $('.iStart').attr('src', 'img/metro/M_' + numStationStart.ligne + '.png');
                        if (numStationEnd)
                            $('#Ends').attr('src', 'img/metro/M_' + numStationEnd.ligne + '.png');

                    }

                }

                return this;
            },

            btnMapView_clickHandler: function (event) {
                $.mobile.jqmNavigator.pushView(new MapView());

            },
            start: function (event) {
                $.mobile.jqmNavigator.pushView(new StartView());

            },
            end: function (event) {
                $.mobile.jqmNavigator.pushView(new EndView());

            },
            start_alarm: function (event) {
                console.log("gogo");
                $('#counter').empty();
                $('#counter').countdown({
                    stepTime: 1,
                    format: 'mm:ss',
                    startTime: "00:50",
                    digitImages: 6,
                    digitWidth: 53,
                    digitHeight: 77,
                    image: "img/digits.png"
                });
            }

        });
        return HomeView;
    });