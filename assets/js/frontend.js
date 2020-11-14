;(function ($) {

  const httpStatus = {
    100: "Continue",
    101: "Switching Protocols",
    102: "Processing",
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    207: "Multi-Status",
    208: "Already Reported",
    226: "IM Used",
    300: "Multiple Choices",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    306: "Reserved",
    307: "Temporary Redirect",
    308: "Permanent Redirect",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Request Entity Too Large",
    414: "Request-URI Too Long",
    415: "Unsupported Media Type",
    416: "Requested Range Not Satisfiable",
    417: "Expectation Failed",
    422: "Unprocessable Entity",
    423: "Locked",
    424: "Failed Dependency",
    425: "Unassigned",
    426: "Upgrade Required",
    427: "Unassigned",
    428: "Precondition Required",
    429: "Too Many Requests",
    430: "Unassigned",
    431: "Request Header Fields Too Large",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates (Experimental)",
    507: "Insufficient Storage",
    508: "Loop Detected",
    509: "Unassigned",
    510: "Not Extended",
    511: "Network Authentication Required"
  };

  const app = {

    preload: `<div class="wp-ajax-preload" style="margin: -50px; position: fixed;z-index: 9999;display: flex;align-items: center;justify-content: center;width: 110%;height: 110%;background-color: rgba(0,0,0, .5);"><img src="${wpAjax.plugin_url}/assets/images/preload.jpg" style="width: 100px;"></div>`,

    init: () => {
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

      $.get(url)
        .success((response) => {

          response = response.replace(/(<[a-zA-Z]+>|.*?[^?]>)/, `$1 ${app.preload}`);

          const newDoc = document.open("text/html", "replace");
          newDoc.write(response);
          newDoc.close();

          if (replaceURL) {
            app.replaceURL(url);
          }
        })
        .done(() => {
          app.hidePreload();
        })
        .fail(({status}) => {
          console.log(httpStatus[status]);
          alert('Oops! AJAX Error');
        });
    },

    showPreload: () => {
      if ($('.wp-ajax-preload', $(document)).length) {
        $('.wp-ajax-preload', $(document)).fadeIn(500);
      } else {
        $('body').prepend(app.preload);
      }
    },

    hidePreload: () => {
      $('.wp-ajax-preload').fadeOut(500);
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

