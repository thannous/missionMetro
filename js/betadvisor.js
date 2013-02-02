$('[data-role=page]').live('pageshow', function (event, ui) {
            $("#" + event.target.id).find("[data-role=footer]").load("../footer.html", function(){
                $("#" + event.target.id).find("[data-role=navbar]").navbar();
            });
        });
