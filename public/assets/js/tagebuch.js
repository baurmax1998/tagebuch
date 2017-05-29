location.hash = "";
$(document).ready(function() {
    $.ajax({
        method: "GET",
        url: "/getFiles",
        //data: JSON.stringify(data)
    }).done(function(msg) {
        console.log(msg);
        for (var i = 0; i < msg.length; i++) {
            addLink(msg[i], msg[i]);
        }
        if (!msg[i - 1].match(new Date().format("%Y-%m-%d")))
            addLink("heute", new Date().format("%Y-%m-%d"));
    });
    $("#body").hide();

    window.onhashchange = function() {
        if (location.hash.replace("#", "") != "")
            initEdit(JSON.parse(location.hash.replace("#", "")));
    }

});

function addLink(name, datei) {
    $("#dateien")
        .append(
            $("<li>")
            .append(
                $("<a>")
                .text(name)
                .attr("href", "#" + JSON.stringify({ datei: datei }))
            )
        );
}



function initEdit(data) {
    $("#body").show();
    $("#dateien").hide();

    $.ajax({
        method: "GET",
        url: "/getDatei",
        data: JSON.stringify({ datei: data.datei })
    }).done(function(msg) {
        console.log(msg);

        $("#body").html(msg.toString());
        var socket = io();
        $("#body").keyup(function(e) {
            console.log("edit");
            socket.emit('edit', getEdit());
        });
        socket.on('edit', function(data) {
            $("#body").html(data.message + "<div><br></div>");
            toLastRowFrom("#body");
        });
    });

}

function getEdit() {
    var data = JSON.parse(location.hash.replace("#", ""));
    return {
        context: data.datei,
        content: $("#body").html(),
    };
}

function toLastRowFrom(element) {
    $($(element).children()[$(element).children().size() - 1]).select()
}