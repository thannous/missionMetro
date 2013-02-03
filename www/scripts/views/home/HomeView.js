
define(['jquery', 'underscore', 'Backbone', 'views/map/MapView','views/home/StartView','views/home/EndView', 'text!templates/home/HomeView.html'],
    function ($, _, Backbone, MapView,StartView, EndView, HomeViewTemplate) {
        var HomeView = Backbone.View.extend({

            events:{
                'click #btnMapView':'btnMapView_clickHandler',

                'click #nstart' : 'start',
                'click #nend' : 'end'

            },

            render:function () {
                this.$el.html(_.template(HomeViewTemplate));
                if(localStorage.getItem('start')){
                     var p = localStorage.getItem('start');
                    var depart = JSON.parse(p);
                    var q = localStorage.getItem('end');
                    var arriver = JSON.parse(q);
                    console.log(q);
                    var numStationStart = JSON.parse(localStorage.getItem('startStation'));
                    console.log(numStationStart);
                    var numStationEnd = JSON.parse(localStorage.getItem('endStation'));
                    console.log(numStationEnd);
                   if (depart){

                    $("#nstart").text(depart.name);
                    $("#nend").text(arriver.name);
                       $('.iStart').attr('src','img/metro/M_'+ numStationStart.ligne +'.png');
                       if(numStationEnd)
                         $('#Ends').attr('src','img/metro/M_'+ numStationEnd.ligne +'.png');

                   }

                }
                $('#counter').countdown({
                    stepTime: 60,
                    format: 'mm:ss',
                    startTime: "32:55",
                    digitImages: 6,
                    digitWidth: 53,
                    digitHeight: 77,
                    image: "img/digits.png"
                });
                return this;
            },

            btnMapView_clickHandler:function (event) {
                $.mobile.jqmNavigator.pushView(new MapView);

            },
            start:function (event) {
                $.mobile.jqmNavigator.pushView(new StartView);

            },
            end:function (event) {
                $.mobile.jqmNavigator.pushView(new EndView);

            }

        });
        return HomeView;
    });