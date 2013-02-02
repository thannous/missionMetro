
define(['jquery','underscore', 'Backbone', 'text!templates/home/StartView.html'],
    function ($, _, Backbone, StartViewTemplate) {

        var StartView = Backbone.View.extend({

            events:{
                'click #btnBack':'btnBack_clickHandler'
            },
            initialize: function(){


            },
            render:function () {
                this.$el.html(_.template(StartViewTemplate));
                var input = $('#input_start');
                var options = {
                    bounds: defaultBounds,
                    types: ['geocode '],
                };
                autocomplete = new google.maps.places.Autocomplete(input, options);
                componentRestrictions: {country: 'fr'}
          


                return this;

            },


            btnBack_clickHandler:function (event) {
                $.mobile.jqmNavigator.popView();
            }

        });

        return StartView;
    });
