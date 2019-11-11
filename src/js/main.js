$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.modal').modal();

    el = document.querySelector('.tabs');
    let instance = M.Tabs.init(el);


    $('.modal-trigger').click(function () {
        instance.select('test2');
        instance.updateTabIndicator();
    });

});


