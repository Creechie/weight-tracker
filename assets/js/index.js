$(function () {
    $('#btn-sidebar-toggle').click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});