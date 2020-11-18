;(function ($) {

  const app = {

    preload: `<div class="wp-ajax-preload" style="margin: -50px; position: fixed;z-index: 9999;display: flex;align-items: center;justify-content: center;width: 110%;height: 110%;background-color: rgba(0,0,0, .5);">
<img src="${wpAjax.plugin_url}/assets/images/preload.gif" style="width: 100px;left: 50%;top: 50%;position: absolute;transform: translate(-50%, -50%);"></div>`,

    init: () => {

      app.hidePreload();

      $(document).on('click', 'a:not([href^="#"])', app.handleClick);

    },

    handleClick: function (e) {

      if (app.isExternal(this)) {
        return
      } else {
        e.preventDefault();
      }

      const url = $(this).attr('href');

      app.getPage(url);

    },

    getPage: (url, replaceURL = true) => {
      app.showPreload();

      $.get(url, (response) => {

        response = response.replace(/(<[a-zA-Z]+>|.*?[^?]>)/, `$1 ${app.preload}`);

        const newDoc = document.open("text/html", "replace");
        newDoc.write(response);
        newDoc.close();

        if (replaceURL) {
          app.replaceURL(url);
        }

      }).done(() => {
          app.hidePreload();
        })
        .fail((error) => {
          console.log(error);
          alert('Oops! AJAX Error');
        });
    },

    showPreload: () => {
      if ($('.wp-ajax-preload', $(document)).length) {
        $('.wp-ajax-preload', $(document)).fadeIn(300);
      } else {
        $('body').prepend(app.preload);
      }
    },

    hidePreload: () => {
      $('.wp-ajax-preload').fadeOut(300);
    },

    isExternal: function (link) {
      return (link.host !== window.location.host);
    },

    replaceURL: (url) => {

      if (history.pushState) {
        const URL = url.replace(/^.*\/\/[^\/]+/, '');
        window.history.pushState('', '', URL);
      } else {
        document.location.href = url;
      }
    },

  };

  $(document).ready(app.init);

  onpopstate = function () {
    const url = location.href;

    app.getPage(url, false);
  }

})(jQuery);

