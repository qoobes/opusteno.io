function send() {
    let approve;
    approve = window.confirm("Jeste li sigurni da zelite poslati poruku?")
    if (approve) {
        alert("Poruka uspjesno poslana!")
        //actually send the message
    }
}

function redirect() {
    let approve;
    approve = window.confirm("Jeste li sigurni da zelite napustiti form?")
    if (approve) {



        var elem2 = $("#mainNav");
        var pos2 = 0;
        var id2 = setInterval(frame2, 5);

        function frame2() {
            if (pos2 == 350) {
                clearInterval(id);
            } else {
                pos2++;
                elem2.css("height", pos2*10 + "px");
            }
        }


        setTimeout(() => {
            window.location = "/";

        }, 1000);
        //actually send the message
    }
}