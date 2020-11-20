import wpAjaxPreload from './preload';

(function ($) {

  const app = {

    preload: `<div id="wp-ajax-preload" style="position: fixed;width: 100%;height: 100%;background: rgba(0,0,0, .5);display: flex;align-items: center;justify-content: center;z-index: 9999;"><img src="${wpAjax.plugin_url}/assets/images/preload.gif" style="width: 100px;"></div>`,

    init: () => {
      app.hidePreload();
      $(document).on('click', 'a:not([href^="#"])', app.handleClick);
    },

    /**
     * handle the link click
     *
     * @param e
     */
    handleClick: function (e) {

      const url = $(this).attr('href');

      if (app.isExternal(this)) {
        return
      } else {
        if (url.includes('/wp-admin/')) {
          return;
        }
        e.preventDefault();
      }

      app.getPage(url);

    },

    /**
     * get the page content by ajax request
     *
     * @param url
     * @param replaceURL
     */
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

      }).fail((error) => {
        console.log(error);
        app.hidePreload();
        alert('Oops! AJAX Error');
      });
    },

    /**
     * Show ajax preloader image
     */
    showPreload: () => {
      if ($('#wp-ajax-preload', $(document)).length) {
        $('#wp-ajax-preload', $(document)).addClass('active');
      } else {
        $('body').prepend(app.preload);
      }
    },

    /**
     * hide ajax preloader image
     */
    hidePreload: () => {
      $('#wp-ajax-preload').removeClass('active');
    },

    /**
     * check whether the link is external or not
     *
     * @param link
     * @returns {boolean}
     */
    isExternal: function (link) {
      return (link.host !== window.location.host);
    },

    /**
     * replace browser url
     *
     * @param url
     */
    replaceURL: (url) => {

      if (history.pushState) {
        const URL = url.replace(/^.*\/\/[^\/]+/, '');
        window.history.pushState('', '', URL);
      } else {
        document.location.href = url;
      }
    },

  };

  wpAjaxPreload();
  app.hidePreload();
  $(document).ready(app.init);

  /**
   * handle browser back/ next navigation
   */
  onpopstate = function () {
    const url = location.href;

    app.getPage(url, false);
  }

})(jQuery);

