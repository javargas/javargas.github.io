if (!window.trb) trb = {};
if (trb.userTiming) trb.userTiming('reg before main');
else trb.userTiming = function() {};

(function bootstrapRegistration() {
  var $ = (window.i$ || window).jQuery;

  !$ ? (trb.runInfuse || (trb.runInfuse = [])).push(bootstrapRegistration) : (function(conf) {
    !('on' in $.fn) && $.extend($.fn, { on: $.fn.bind, off: $.fn.unbind }); //shim
    trb.userTiming('reg after jquery');

    initRegistration($, {
      productCode: conf.reg_product_code,
      registrationHostname: conf.reg_hostname,
      ssorBaseUrl: conf.reg_ssor_base_url || 'ssor.tribdss.com',
      signInUrl: conf.reg_signin_url,
      signUpUrl: conf.reg_signup_url,
      navProfileUrl: conf.reg_nav_profile_url,
      navNewsletterUrl: conf.reg_newsletter_url,
      navSelector: conf.reg_nav_container_selector,
      nav2Selector: conf.reg_nav2_selector,
      navigationCSS: '[data-reg-rendered]{z-index:2147483605}[data-reg-text]:before{content:attr(data-reg-text)}[data-reg-username]:before{content:attr(data-reg-username)}[data-reg-handler][data-reg-username],[data-reg-loggedin] [data-reg-handler=signInHandler],[data-reg-loggedin] [data-reg-handler=signUpHandler],[data-reg-loggedin] [data-reg-role=navspace],[data-reg-role=minimodal]{display:none}[data-reg-handler],[data-reg-loggedin] [data-reg-username]{display:inline-block}[data-reg-role=navspace]{display:inline}[data-reg-loggedin] .navShow[data-reg-role=minimodal],[data-reg-loggedin] [data-reg-rendered].navShow [data-reg-role=minimodal]{display:block}[data-reg-role=base] [data-reg-role=minimodal]{contain:layout style}.tS12{zoom:1}.bar-dss{display:flex;align-items:center}.so-reg-login{margin-bottom:5px}.bar-dss [data-reg-role^=button] .met-flyout a{margin-left:5px;padding:3px 0;height:32px;width:208px;line-height:13px}.bar-dss [data-reg-handler=signInHandler]{min-width:82px}.bar-dss [data-reg-role=button_desktop] a:first-line{font-size:12px}.bar-dss [data-reg-role=button_tablet]{display:none}.bar-dss [data-reg-role=button_tablet] .met-flyout a{font-size:9px;width:88px}@media screen and (max-width:799px){.bar-dss [data-reg-role=button_tablet]{display:block}.bar-dss [data-reg-handler=signInHandler]:after,.bar-dss [data-reg-role=button_desktop]{display:none}.bar-dss [data-reg-handler=signInHandler]{min-width:16px;padding-right:10px}.bar-dss [data-reg-handler=signInHandler] span{display:none}}@media screen and (max-width:414px){.bar-dss [data-reg-role=button_mobile] a[data-met-return]{font-family:\'Open Sans\'!important;font-weight:700!important;display:block;width:80px;padding:8px 0;font-size:10px}.bar-dss [data-reg-role=button_tablet]{display:none}.bar-dss [data-reg-role=button_mobile] b{font-weight:700}}.bar-dss [data-reg-handler=signUpHandler],.bar-dss [data-reg-role=navspace],[data-reg-role=minimodal]{display:none!important}.bar-dss [data-reg-handler=signInHandler],.bar-dss [data-reg-handler=toggleNavigation]{touch-action:none;margin-left:15px;text-align:center;line-height:32px;padding:0 5px;color:#fff;order:2}.bar-dss [data-reg-handler=signInHandler] span{font-family:\'Open Sans\'!important;font-size:10px;font-weight:700;text-transform:uppercase;white-space:nowrap;letter-spacing:1px;position:relative;top:-1px;margin-left:0;display:block}.bar-dss [data-reg-handler]:focus,.bar-dss [data-reg-handler]:hover{text-decoration:none!important;border:none;color:#333}.bar-dss [data-reg-handler=signInHandler]:before,.bar-dss [data-reg-handler=toggleNavigation]:before{content:\"\"}.bar-dss [data-reg-handler=signInHandler]>svg{width:17px;height:17px;top:3px;position:relative;margin-right:-2px}.bar-dss [data-reg-handler=toggleNavigation]>svg{width:17px;height:17px;position:relative;top:2px}@media screen and (max-width:799px){.bar-dss [data-reg-handler=signInHandler]{margin-left:7px}}.reg-dummy-nav{display:none}.bar-dss [data-reg-handler=signInHandler] span,.bar-dss [data-reg-role=button_mobile] a[data-met-return]{letter-spacing:.5px}.bar-dss [data-reg-handler=signInHandler]{color:#333;background-color:#fff;border-radius:3px}.met-rule-1043 [data-met-return],.met-rule-1063 [data-met-return]{display:none!important}',
      navSvgs: {
        signin: conf.svg_signin || '',
        nav_profile: conf.svg_nav_profile || ''
      },
      successfulLoginRedirect: conf.reg_successful_login_redirect || '',
      dialogJS: 'chiarc-dialog-1q2w3-15368472305086780267.js',
      metricsAccountId: conf.reg_metrics_account_id,
      matherMarketId: conf.reg_mather_market_id,
      enableOmniture: conf.reg_enable_omniture,
      ampGoogleAnalyticsId: conf.reg_amp_google_analytics_id,
      regCookieDomain: conf.reg_cookie_domain,
      navLabels: {
        profile: conf.reg_nav_profile_text,
        newsletters: conf.reg_nav_newsletters_text,
        signIn: conf.reg_nav_sign_in_text,
        signUp: conf.reg_nav_sign_up_text,
        signOut: conf.reg_nav_sign_out_text
      },
      adaARIAHidden: conf.ada_aria_hidden,
      fbiaVersion: conf.fbia_version || '1',
      authServer: conf.auth_server,
      sameSiteCookie: conf.same_site_cookie
    }, (() => {
  let samesiteNone = {exports: {}};
  ((module, require, exports) => { /*
 * From https://github.com/linsight/should-send-same-site-none
 * commit 2f71b52d610e4d4d12a2722d83d8f15d95e6e6a3 on 2020-04-29
 * removed `shouldSendSameSiteNone` for smaller file
 */
function intToString(intValue) {
  return String(intValue);
}

function stringToInt(strValue) {
  return parseInt(strValue, 10) || 0;
}

// Don’t send `SameSite=None` to known incompatible clients.
function isSameSiteNoneCompatible(useragent) {
  return !isSameSiteNoneIncompatible(String(useragent));
}

// Classes of browsers known to be incompatible.
function isSameSiteNoneIncompatible(useragent) {
  return (
    hasWebKitSameSiteBug(useragent) ||
    dropsUnrecognizedSameSiteCookies(useragent)
  );
}

function hasWebKitSameSiteBug(useragent) {
  return (
    isIosVersion(12, useragent) ||
    (isMacosxVersion(10, 14, useragent) &&
      (isSafari(useragent) || isMacEmbeddedBrowser(useragent)))
  );
}

function dropsUnrecognizedSameSiteCookies(useragent) {
  return (
    (isChromiumBased(useragent) &&
      isChromiumVersionAtLeast(51, useragent) &&
      !isChromiumVersionAtLeast(67, useragent)) ||
    (isUcBrowser(useragent) && !isUcBrowserVersionAtLeast(12, 13, 2, useragent))
  );
}

// Regex parsing of User-Agent string.
function regexContains(stringValue, regex) {
  var matches = stringValue.match(regex);
  return matches !== null;
}

function extractRegexMatch(stringValue, regex, offsetIndex) {
  var matches = stringValue.match(regex);

  if (matches !== null && matches[offsetIndex] !== undefined) {
    return matches[offsetIndex];
  }

  return null;
}

function isIosVersion(major, useragent) {
  var regex = /\(iP.+; CPU .*OS (\d+)[_\d]*.*\) AppleWebKit\//;
  // Extract digits from first capturing group.
  return extractRegexMatch(useragent, regex, 1) === intToString(major);
}

function isMacosxVersion(major, minor, useragent) {
  var regex = /\(Macintosh;.*Mac OS X (\d+)_(\d+)[_\d]*.*\) AppleWebKit\//;
  // Extract digits from first and second capturing groups.
  return (
    extractRegexMatch(useragent, regex, 1) === intToString(major) &&
    extractRegexMatch(useragent, regex, 2) === intToString(minor)
  );
}

function isSafari(useragent) {
  var safari_regex = /Version\/.* Safari\//;
  return useragent.match(safari_regex) !== null && !isChromiumBased(useragent);
}

function isMacEmbeddedBrowser(useragent) {
  var regex = /^Mozilla\/[\.\d]+ \(Macintosh;.*Mac OS X [_\d]+\) AppleWebKit\/[\.\d]+ \(KHTML, like Gecko\)$/;

  return regexContains(useragent, regex);
}

function isChromiumBased(useragent) {
  const regex = /Chrom(e|ium)/;
  return regexContains(useragent, regex);
}

function isChromiumVersionAtLeast(major, useragent) {
  var regex = /Chrom[^ \/]+\/(\d+)[\.\d]* /;
  // Extract digits from first capturing group.
  var version = stringToInt(extractRegexMatch(useragent, regex, 1));
  return version >= major;
}

function isUcBrowser(useragent) {
  var regex = /UCBrowser\//;
  return regexContains(useragent, regex);
}

function isUcBrowserVersionAtLeast(major, minor, build, useragent) {
  var regex = /UCBrowser\/(\d+)\.(\d+)\.(\d+)[\.\d]* /;
  // Extract digits from three capturing groups.
  var major_version = stringToInt(extractRegexMatch(useragent, regex, 1));
  var minor_version = stringToInt(extractRegexMatch(useragent, regex, 2));
  var build_version = stringToInt(extractRegexMatch(useragent, regex, 3));
  if (major_version !== major) {
    return major_version > major;
  }
  if (minor_version != minor) {
    return minor_version > minor;
  }

  return build_version >= build;
}

module.exports = {
  isSameSiteNoneCompatible: isSameSiteNoneCompatible
};
 })(samesiteNone, null, samesiteNone.exports);
  return {isSameSiteNoneCompatible: samesiteNone.exports.isSameSiteNoneCompatible};
})()
);

    /* now with less everything */

function initRegistration($, config, mods) {
  var ready = $.merge(trb.registration || [], window.registration || []), loc = window.location, ua = navigator.userAgent,
    sameSiteStr = config.sameSiteCookie==='true' && mods.isSameSiteNoneCompatible(ua) ? ';SameSite=None;Secure' : '',
    tmpl, conf, evnt, util, ajax, user, mngr, createUser, oldUData; // Aliases. Search `[alias] = ` to jump to sections; also reg.nav

  var reg = trb.registration = window.registration = { version: 4, jQuery: $ };

  reg.template = tmpl = {
    parse: function(name, data) {
      if (!name) name = ''; if (!data) data = {};
      var tmpls = this.templates, click = data.onClick, parsed, ns,
        raw = name.length == 1 ? name[0] : (((ns = name.split('.')) && ns[0] in tmpls) && tmpls[ns[0]][ns[1]] || tmpls[name]);
      if (!raw) return '';

      if (click) click = function(e) {
        e.preventDefault();
        data.onClick.call(this, e);
      };

      $.each($.makeArray(data), function(i, part) {
        var cache = {}, html = raw.replace(/\$\{([^\}]*)\}/g, function(i, key) {
          if (!(key in cache)) {
            var info = key in part ? part[key] : ( ((ns = key.split('.')[1]) && ns in part) ? part[ns] : part );
            cache[key] = info == null ? '' : ( info.jquery ? info : ( /(object|array)/.test(typeof info) ? tmpl.parse(key, info) : info.toString() ) );
          }

          return cache[key].jquery ? '<b data-tmpl="' + key + '" />' : cache[key];
        });

        /data-tmpl/.test(html) && $('b[data-tmpl]', (html = $('<div />').html(html))).each(function() {
          var set = $(this);
          set.replaceWith(cache[set.attr('data-tmpl')]);
        });

        html = html.jquery ? html.contents().click(click || function() {}) : ( click ? ( /^<.*>$/.test(html) ? $(html) : $('<span />').html(html) ).click(click) : html );
        parsed = parsed ? parsed[ parsed.jquery ? 'add' : 'concat' ](html) : html;
      });

      return parsed || '';
    },
    templates: {}
  };

  (function createConfig() {
    reg.config = conf = {
      get: function get(name) {
        return ( name in config ? config[name] : null );
      },
      set: function(key, val) {
        if (typeof key == 'string') config[key] = val;
        else $.extend(true, config, key);
      }
    };

    conf.set({
      regPath: config.registrationHostname.replace(/\/?$/, '/registration/'),
      cookieDomain: config.regCookieDomain || ( /^[\d.]+$/.test(loc.host) ? loc.host : '.' + ( loc.host.split('.').length < 3 ? loc.host : loc.host.replace(/^.*?\./, '') ) )
    });
  })();

  (function createEvents() {
    var listeners = {};

    reg.events = evnt = {
      on: function(type, listener) {
        (listeners[type] || (listeners[type] = [])).push(listener);
      },
      next: function(type, listener) {
        this.on(type, function once(param) {
          var handlers = listeners[type]; //clear myself
          handlers[$.inArray(once, handlers)] = function() {};
          listener(param);
        });
      },
      fire: function(type, param) {
        $.each(listeners[type] || [], function(i, listener) {
          listener(param);
        });
      }
    };
  })();

  reg.mods = mods;

  reg.utils = util = {
    cookies: {
      enabled: function() {
        this.set('c_', '1');
        var val = this.get('c_');
        this.del('c_');
        return !!val;
      },
      get: function(name) {
        var value = document.cookie.split(name + '=');
        return value.length > 1 ? unescape(value[1].split(';')[0]) : undefined;
      },
      set: function(name, value, days) {
        document.cookie = name + '=' + escape(value) + ';expires=' + new Date( ~days ? (days || 180) * 86400000 + new Date().getTime() : 0 ).toGMTString() + ';path=/;domain=' + conf.get('cookieDomain') + sameSiteStr;
      },
      del: function(name) {
        this.set(name, '', -1);
      }
    },
    url: {
      get: function(lcn) {  // extracts params from Location
        var params = {}, raw = lcn.search;

        raw && $.each(raw.substr(1).split('&'), function(i, pair) {
          var param = pair.split('=');
          if (param.length > 1) params[param.shift()] = decodeURIComponent(param.join('=')); else params[pair] = true;
        });

        return params;
      },
      set: function(url, params) {  // adds params to url
        var pairs = [];

        $.each(params || {}, function(key, val) {
          var encode = key[0] == '_'; // magic prefix to enable url-enc of this value
          pairs.push(key.substr(encode) + ( val ? '=' + ( encode ? encodeURIComponent(val) : val ) : '' ));
        });

        return pairs.length ? (url = url.split('#'))[0] + ( /\?/.test(url[0]) ? '&' : '?' ) + pairs.join('&') + ( url[1] ? '#' + url[1] : '' ) : url;
      },
      del: function(find, apply) {
        var clean = loc.href.replace(find, '').replace('?&', '?').replace(/(\?|&)#/, '#').replace(/(\?|&|#)$/, '');

        if (!apply) return clean; else try { loc.hash = loc.hash; //bugzilla 1422334
          history.replaceState ? history.replaceState(history.state, document.title, clean) : util.redirectUser(clean);
        } catch (e) {}
      }
    },
    // `url` will be fetched and evaluated as JS (omit protocol).
    // The JS must set a property `context[item]`, which is passed to `success`
    script: function load(context, item, url, success, prelink, failure) {
      evnt.next('reg_queue_' + item, success);

      if (!exists() && !load[item]) {
        trb.userTiming('reg ' + item + ' request');
        load[item] = true;

        if (prelink && !/iPhone|iPad|iPod/.test(ua)) {
          var head = $('head');

          $.each(prelink, function(domain, keys) {
            var cross = /c/.test(keys) ? 'crossorigin' : ''; domain = ( /s/.test(keys) ? 'https:' : '' ) + '//' + domain;
            (/p/.test(keys) || cross) && (!/MSIE|Trident|Safari/.test(ua) || /Chrome|Android|CriOS/.test(ua)) && head.append('<link rel="preconnect" href="' + domain + '" ' + cross + ' />');
            /d/.test(keys) && head.append('<link rel="dns-prefetch" href="' + domain + '" />');
          });
        }

        $.ajax({ url: '//' + url, dataType: 'script', cache: true,
          success: function pollItem() {
            !exists(true) && setTimeout(pollItem, 50);
          },
          error: function() {
            failure && failure();
          }
        });
      }

      function exists(file) {
        if (item in context) {
          file && trb.userTiming('reg ' + item + ' response');
          return !evnt.fire('reg_queue_' + item, context[item]); //true
        }
      }
    },
    redirectUser: function(url) {
      url = $('<a />').attr('href', url).attr('href'); //if non-anchor part wasnt different, refresh
      loc.href.split('#')[0] == url.split('#')[0] ? loc.reload() : loc[ loc.href.split('?')[0] == url.split('?')[0] ? 'replace' : 'assign' ](url);
    },
    checkCompatible: function(dialog, name) {
      if (/Android/.test(ua) && !/Chrome/.test(ua) && ua.match(/Android ((\d\.)+)/) && parseFloat(ua.match(/Android ((\d\.)+)/)[1]) < 4.4) {
        if (dialog) {
          $('.reg-title, form > :not(.reg-cancel)', dialog).addClass('disabled');
          $('.reg-content', dialog).prepend('<div class="reg-disabled">' + ( $('html').is('[data-dss-meterup]') ? 'Premium subscription access and other advanced features are not supported' : 'You must log in or register to continue, but we do not support this feature' ) + ' in the version of Android Browser you are using due to a security flaw. Please use the <a href="https://play.google.com/store/apps/details?id=com.android.chrome" target="_blank" rel="noopener">Google Chrome</a> browser or upgrade your Android operating system to continue.</div>');
        } else return mngr.showMessageDialog(); //trigger blank dialog
      } else return true;
    },
    // `name` is required, the other 2 args control the cache action
    cache: function(name, value, limit) {
      try {
        if (window.localStorage) {
          var data, today = new Date;

          if (limit) { // GET. `value` callback receives data if it's newer than `limit` days
            if ((data = localStorage.getItem(name)) && (data = JSON.parse(data)) && today.setDate(today.getDate() - limit) < new Date(data.cachedDate)) {
              value && value(data);
              return true;
            }
          } else if (value != null) { // SET. `value` is object to be stored
            if (!value.cachedDate) value.cachedDate = today;
            localStorage.setItem(name, JSON.stringify(value));
          } else localStorage.removeItem(name); // REMOVE (`value` is null/undefined)
        }
      } catch (e) {}
    },
    poll: function(selector, callback, context) {
      selector && (function search() {
        var self = $(selector, context);
        !self.length && (selector == 'body' || ( 'limit' in search ? --search.limit : search.limit = 100 )) ? setTimeout(search, 50) : callback(self);
      })();
    }
  };

  // NOTE: this is only true in a 3rd-party iframe when cookies are blocked. Note that we only check for hasStorageAccess's existence (feature-check); we don't call it because we don't want to wait for the Promise.
  util.iframeITP = document.hasStorageAccess && !util.cookies.enabled(); // this can theoretically become true later if access is granted, but we ignore that because we never request access

  reg.ajax = ajax = {
    _send: function(handlers, inputs) {
      // NOTE: the pre-DSS-11000 code extended an empty object if `inputs.prefix` was truthy
      var params = $.extend(true, {
        data: $.extend({
          product_code: conf.get('productCode'),
          master_id: user.getMasterId()
        }, ajax.stateless)
      }, handlers, inputs), errors = params.callback || conf.get('ajaxErrors') || function() {};

      var config = {
        url: (params.prefix || conf.get('regPath')) + params.url,
        type: 'GET', data: params.data || {}, dataType: 'jsonp', cache: false,
        success: function(data) {
          if (ajax.stateless && !ajax.stateless.signon_token && data.loginToken) ajax.stateless.signon_token = data.loginToken;

          if (params.callback) params.callback(data); else {
            var errorMsg = data.err || data.errMsg || data.errorMessage || data.errorThrown;
            errorMsg ? errors(errorMsg) : params.success(data);
          }
        },
        error: function() {
          errors('There was a network issue; please try again later');
        }
      };

      'password' in config.data && this._cors(config);
      config.url && $.ajax(config);
    },
    getServersideLoginCookie: function(callback) {
      this._send(null, {
        prefix: conf.get('authServer'),
        url: '/read_auth',
        callback: callback || function() {}
      });
    },
    setServersideLoginCookie: function(mId, puid, callback) {
      const data = {master_id: mId, puid: puid},
            ampRID = mngr.user.amp.getReaderID();
      ampRID && (data.amp_r_id = ampRID);
      this._send(null, {
        prefix: conf.get('authServer'),
        url: '/authenticate',
        callback: callback || function() {},
        data: data
      });
    },
    setClientsideLoginCookie: function() {
      util.cookies.set('c_mId', user.getMasterId());
      util.cookies.set('c_PUID', user.getPUID());
    },
    deleteServersideLoginCookie: function(callback) {
      util.cookies.set('c_mId', '');
      util.cookies.set('c_PUID', '');
      this._send(null, {
        prefix: conf.get('authServer'),
        url: '/logout',
        callback: callback || function() {}
      });
    },
    readAmpId: function(callback) {
      if (util.iframeITP) {
        const rid = mngr.user.amp.getReaderID();
        this._send(null, {
          prefix: conf.get('authServer'),
          url: '/amp/read_id',
          data: { amp_r_id: rid },
          callback: callback
        });
      } else callback();
    },
    refreshAmpLogin: function(rid, callback) {
      callback = callback || (() => {});
      if (!rid)
        callback();
      else {
        this._send(null, {
          prefix: conf.get('authServer'),
          url: '/amp/refresh_login',
          data: { amp_r_id: rid },
          callback: callback
        });
      }
    }
  };

  (createUser = function createUser() {
    var data = {}, name = 'trb.registration.userData';

    reg.user = user = {
      importUserData: function(params) {
        var puid = data.PUID;  // preserve PUID because backend info excludes it
        $.each(data, function(key) {
          delete data[key];
        });
        puid && (data.PUID = puid);

        $.extend(data, params);
      },
      exportUserData: function() {
        return data;
      },
      getMasterId: function() {  // enc
        return data.masterId || '';
      },
      setMasterId: function(masterId) {
        data.masterId = masterId || '';
      },
      getConsumerId: function() {  // plain
        return data.consumerId || '';
      },
      getPUID: function() {  // enc
        return data.PUID || '';
      },
      setPUID: function(e) {
        data.PUID = e || '';
      },
      getUsername: function() {
        return data.userName || '';
      },
      getFirstName: function() {
        return data.firstName || '';
      },
      getLastName: function() {
        return data.lastName || '';
      },
      getDisplayName: function() {
        return data.displayName || this.getUsername();
      },
      isLoggedIn: function() {
        return !!this.getMasterId();
      },
      getZipCode: function() {
        return data.zipCode || '';
      },
      getEmailAddress: function() {
        var ids = $.makeArray(data.linkedIdentifiers);
        return (data.email || (ids.length && ids[0].emailAddress) || '').toLowerCase();
      },
      getBirthDate: function() {
        return data.birthDate || '';
      },
      getBirthYear: function() {
        return data.birthYear || '';
      },
      getIncome: function() {
        return data.incomeLevel || '';
      },
      getGender: function() {
        return data.gender || '';
      },
      getTos: function() {
        return data.tos || '';
      }
    };

    user.setMasterId(util.cookies.get('c_mId'));
    user.setPUID(util.cookies.get('c_PUID'));

    oldUData && (util.cache(name, oldUData), oldUData=null);  // restore, in case cookie was missing the first time
    util.cache(name, function(cache) {
      if (user.getMasterId() == cache.masterId)
        user.importUserData(cache);
      else {
        !user.getMasterId() && (oldUData = cache);  util.cache(name);
      }
    }, 180);
  })();

  (function initNavigation() {
    var logflag = 'data-reg-loggedin', nameattr = 'data-reg-username', handattr = 'data-reg-handler',
      handle = '[' + handattr + ']', doneflag = 'data-reg-rendered', selector = conf.get('navSelector');
    $('head').append('<style>' + conf.get('navigationCSS') + '</style>');

    $.extend(reg, {
      nav: {
        signInHandler: function() {
          var eventOriginEl = this,
              config = { events: 
                { onClose: function() { eventOriginEl.focus(); } }// return focus to opening element
              }
          reg.nav._link.call(this, conf.get('signInUrl'), mngr.showLoginDialog, config);
        },
        signUpHandler: function() {
          reg.nav._link.call(this, conf.get('signUpUrl'), mngr.showRegistrationDialog);
        },
        profileHandler: function() {
          reg.nav._link.call(this, conf.get('navProfileUrl'), mngr.showProfileDialog);
        },
        newsletterHandler: function() {
          reg.nav._link.call(this, conf.get('navNewsletterUrl'), mngr.showNewsletterDialog);
        },
        signOutHandler: function() {
          mngr.user.logout();
        },
        toggleNavigation: function() {
          var self = this, base = $(self).parent().addClass('navShow');
          $('body').on('click touchstart', navHide);

          function navHide(e) {
            if (e.type == 'click' || !~$(handle, base).index(e.target)) {
              $('body').off('click touchstart', navHide);
              base.removeClass('navShow');

              if (e.target == self) {
                e.stopPropagation();
                e.preventDefault();
              }
            }
          }
        },
        _link: function(url, alt, params) {
          if (util.checkCompatible()) {
            if (url) {
              this.allowed = true;
              var self = $(this);

              if (url[0] == '^') {
                self.attr({ target: '_blank', rel: 'noopener' });
                url = url.substr(1);
              }

              evnt.fire('reg_handler_click', this);
              self.attr('href', url.replace('${return}', encodeURIComponent(loc.href)));
            } else alt && alt(params);
          }
        },
        _update: function() {
          var nav_svgs = conf.get('navSvgs'), navLabels = conf.get('navLabels');
          user.isLoggedIn() ? $('html').attr(logflag, '') : $('html').removeAttr(logflag);

          mngr.user.get(function() {
            util.poll(selector, function(nav) {
              nav.not('[' + doneflag + ']').attr(doneflag, doneflag).append(
                '<a href="#" data-reg-handler="signUpHandler" aria-label="' + navLabels.signUp + '">' + navLabels.signUp + '</a>'+ 
                '<span data-reg-role="navspace"> or </span>'+
                '<a href="#" data-reg-handler="signInHandler" aria-label="' + navLabels.signIn + '">' + nav_svgs.signin + '<span>' + navLabels.signIn + '</span></a>'+
                '<a href="#" data-reg-handler="toggleNavigation" aria-label="Account Navigation" data-reg-username="">' + nav_svgs.nav_profile + '</a>' +
                    '<ul data-reg-role="minimodal">'+
                      '<li><a href="#" data-reg-handler="profileHandler" aria-label="' + navLabels.profile + '">' + navLabels.profile + '</a></li>'+
                      '<li><a href="#" data-reg-handler="newsletterHandler" aria-label="' + navLabels.newsletters + '">' + navLabels.newsletters + '</a></li>'+
                      '<li><a href="#" data-reg-handler="signOutHandler" aria-label="' + navLabels.signOut + '">' + navLabels.signOut + '</a></li>'+
                    '</ul>'
                );

              $('[' + nameattr + ']').attr(nameattr, user.getDisplayName());
              trb.userTiming('reg after nav');
            });
          });
        }
      },
      showDialog: function(name, param) {
        var api = { register: 'Registration', login: 'Login', forgot: 'Password', userProfile: 'Profile', newsletters: 'Newsletter' };
        name in api && mngr['show' + api[name] + 'Dialog'](param);
      },
      // TODO: once this function is available, `reg.push` calls seem to execute immediately instead of waiting (contrast with `ready` array).
      push: function() { //emulate Array.push
        var api = { user: mngr.user.get, login: mngr.user.login, logout: mngr.user.logout, logoutin: mngr.user.switchAccounts,
          event: evnt.on, fire: evnt.fire, modal: reg.showDialog, show: reg.showDialog, reauth: mngr.user.reauthenticate,
          solidopinion: trb.vendor.solidopinion.enable };

        $.each($.makeArray(arguments), function(i, item) {
          if ($.isFunction(item)) item(reg); else {
            if (typeof item == 'string') {
              var temp = {}; temp[item] = null; item = temp;
            }
            $.each(item, function(command, param) {
              var name = command.split('-'), type = name.shift();
              if (command in api) api[command](param); else if (name.length && type in api) api[type](name.join('-'), param);
            });
          }
        });

        return 0;
      }
    });

    //use available jquery method
    if ($().on.length > 3) $(document).on('click', handle, router);
    else if ($().delegate) $(document).delegate(handle, 'click', router);
    else $(handle).live('click', router);

    function router(e) {
      var name = this.handler = $(this).attr(handattr);
      name in reg.nav ? reg.nav[name].call(this) : reg.push(name);
      !this.allowed && e.preventDefault();
    }
  })();

  reg.manager = mngr = {
    user: {
      get: function(callback) {
        !user.isLoggedIn() || user.getConsumerId() ? send() : mngr._load('getInfo', send);
        function send() { callback && callback(user); }
      },
      login: function(masterId, callback, puid) {  // backward compat: keep puid as 3rd arg
        mngr._load(function() {
          evnt.next('reg_after_login', callback || function() {});
          user.setMasterId(masterId);
          user.setPUID(puid);
          mngr.user.getInfo();
        });
      },
      logout: function(callback) {
        mngr.user.setInfo(null, callback);
      },
      syncLoginCookies: function() {
        // fetch serverside cookie and assign to clientside cookie and populate user data
        ajax.getServersideLoginCookie(function(data) {
          var vals = data.values || {};  // if ajax error, `data` is a string, so fallback
          if (vals.master_id) {
            reg.utils.cookies.set('c_mId', vals.master_id);
            // puid can be empty when logged in. It only prevents unlinking.
            reg.utils.cookies.set('c_PUID', vals.puid || '');
            loc.reload();  // DSS assets could be stale after sync
          } else {
            reg.utils.cookies.set('c_mId', '');
            reg.utils.cookies.set('c_PUID', '');
          }
        });
      },
      amp: (function() {  // Only for ITP workaround
        // NOTE: ITP doesn't share the same sandboxed localStorage for iframed subscribe.SITE.com across differently-origined enclosing pages. This prevents us from adding logout logic.
        // Also, in ITP iframe, localStorage is ephemeral - it's cleared when the tab or browser is closed. We only cache for 1 day because there's no way to log out, but it's unlikely the user will keep the tab open for that long.
        let ckey = 'trb.registration.ssorIdForAmp', rID;
        return {
          setReaderID: function(r_id) {  // see awga.html. Set this before using other amp functions
            rID = r_id;
          },
          getReaderID: function() { return rID || ''; },
          // setReaderID must be called before this (used by readAmpId).
          syncSsorId: function(forceFetch) {
            let cdata = {}, exist;
            if (forceFetch) {
              return fetchSync();
            } else {
              exist = util.cache(ckey, d=>{ cdata = d }, 1);
              if (exist) {
                evnt.next('reg_after_logout', mngr.user.amp.delSsorId);
                user.importUserData({masterId: cdata.ssorId, consumerId: cdata.consId});
                return Promise.resolve();
              } else return fetchSync();
            }

            async function fetchSync() {
              let ssorId = await new Promise(readDone => {
                ajax.readAmpId(data => readDone(data.id || ''));
              })

              cdata.ssorId = ssorId;
              user.setMasterId(ssorId);
              user.setPUID('_'); // placeholder to satisfy the server

              cdata.consId = await new Promise(fetchDone => {
                if (ssorId) {
                  let authServer = conf.get('authServer');
                  conf.set('authServer', null);  // skip authenticate this time to avoid cache_temp
                  mngr.user.get(u => { // ssor-backend fetch
                    conf.set('authServer', authServer);
                    fetchDone( u.getConsumerId() );
                  });
                } else fetchDone();
              });

              if (ssorId) {
                if (cdata.consId) {
                  evnt.next('reg_after_logout', mngr.user.amp.delSsorId);
                } else {
                  console.log('[ssor-amp]: ssorId was cached but fetching consId failed');
                  cdata.ssorId = ''; // never store truthy ssorId w/o consId
                }
              }
              util.cache(ckey, cdata); // store, even if fetch returned blanks (limits fetch frequency)
            }
          },
          delSsorId: function() { util.cache(ckey); }
        };
      })(),
      switchAccounts: function() {
        mngr.user.logout(mngr.showLoginDialog);
      },
      rename: function(first, last) {
        var clean = /[\d?!@#$%^&*"`=~_+,:;|<>(){}\[\]\\\/]/g, names = {};
        mngr._load('setProfile', { firstName: (first || '').replace(clean, ''), lastName: (last || '').replace(clean, '') });
      },
      setInfo: function(profile, callback) {
        profile !== true && user.importUserData(profile);
        mngr.user[ profile ? 'setCookies' : 'delCookies' ](function() {
          reg.nav._update();
          evnt.fire('reg_after_log' + ( profile ? 'in' : 'out' ), !!callback);
          callback && callback();
        });
      },
      delCookies: function(callback) {  // NOTE: `callback` only receives the response if ITP-fix is enabled
        util.cache('trb.registration.userData');
        util.cache('trb.registration.authToken');
        util.cookies.del('c_mId');
        util.cookies.del('c_PUID');

        reg.config.get('authServer') ? ajax.deleteServersideLoginCookie(callback) : (callback && callback());
      },
      reauthenticate: function(callback) {
        mngr._load('reauthenticate', callback);
      }
    },
    showMessageDialog: function() {
      mngr._load('showMessageDialog');
    },
    showLoginDialog: function(params) {
      mngr._load('showLoginDialog', params, user.isLoggedIn());
    },
    showRegistrationDialog: function(params) {
      mngr._load('showRegistrationDialog', params, user.isLoggedIn());
    },
    showWelcomeDialog: function(params) {
      mngr._load('showWelcomeDialog', params);
    },
    showPasswordResetDialog: function(params) {
      mngr._load('showPasswordResetDialog', params);
    },
    showPasswordDialog: function(params) {
      mngr._load('showPasswordDialog', params);
    },
    showNameInterceptDialog: function(callback) {
      mngr._load('showNameInterceptDialog', callback);
    },
    showProfileDialog: function(embed) {
      mngr._load('showProfileDialog', embed, user.isLoggedIn());
    },
    showNewsletterDialog: function(embed) {
      mngr._load(function() {
        mngr.showProfileDialog(embed, true);
      });
    },
    _load: function(method, param, silent) {
      method in mngr && !silent && !$('#reg-overlay').length && $('body').append('<div id="reg-overlay" />');

      util.script(reg, 'dialog', conf.get('ssorBaseUrl') + '/reg/tribune/assets/' + conf.get('dialogJS'), function() {
        (mngr[method] || mngr.user[method] || method)(param);
      });
    }
  };

  (function initVendors() {
    var vendor = trb.vendor || (trb.vendor = {}), usega = (trb.data || (trb.data = {})) && trb.data.metrics && trb.data.metrics.ga,
        useomni = conf.get('enableOmniture') === 'true';
        // enableOmniture blueprint will be blank/'false' if we are disabling omniture for a product

    vendor.solidopinion = {
      enable: function enable(callback) {
        var self = vendor.solidopinion, bases = $('div.so_' + ( callback ? 'promo_headline_wrap' : 'comments' ));

        util.script(window, '$SO', 'embed.solidopinion.com/so_wl.js', function(so) {
          if (!self.nav) {
            $('head').append('<style>.so-reg-login{font:12px Arial,sans-serif !important}.so-reg-login a{color: #333;text-decoration: none}.so_comments [data-reg-text]:before{content:attr(data-reg-text)}[data-reg-loggedin] .so_comments [data-reg-handler=show-register],.so_comments [data-reg-handler=signOutHandler]{display:none}[data-reg-loggedin] .so_comments [data-reg-handler=signOutHandler]{display:inline-block}[data-reg-loggedin] .so_comments [data-reg-role="navspace"]{display:inline}.so_comments [data-reg-username]{color:#333}</style>');
            self.nav = $('<div class="so-reg-login" data-reg-role="base" data-reg-rendered="data-reg-rendered"><a href="#" data-reg-handler="signInHandler" data-reg-text="Log In"></a><span data-reg-username=""></span><span data-reg-role="navspace" data-reg-text=" | "></span><a href="#" data-reg-handler="show-register" data-reg-text="Register"></a><a href="#" data-reg-handler="signOutHandler" data-reg-text="Log Out"></a></div>');
            so.setConfig({ contentId: bases.attr('data-content-id'), publisherId: bases.attr('data-publisher'), autoLoginByTronc: true, sitename: bases.attr('data-sitename') });

            so.on('user-login-request', solidOpinionAttemptComment);
            evnt.on('reg_after_login', solidOpinionUpdateUsername);

            evnt.on('reg_after_logout', function solidOpinionAfterLogout() {
              $('[data-reg-username]').removeAttr('data-reg-text');
              so.callAction('logout-user');
            });
            so.on('user-action-request', function(e) {
              /(add(-promo)?|reply)-comment/.test(e.actionType) && solidOpinionAttemptComment(true);
            });
            so.on('user-action-success', function solidOpinionCommented(e) {
              /(add(-promo)?|reply)-comment/.test(e.actionType) && evnt.fire('reg_after_comment');
            });
          }
          if (callback) {
            so.on('hide-wph-popup-success', callback);
            so.callAction('show-wph-popup');
          } else {
            so.callAction('start-widget', 'so_comments');

            (function pollSolidOpinionRendered() {
              bases.length != $('iframe', bases).length ? setTimeout(pollSolidOpinionRendered, 50) : mngr._load(function() {
                bases.each(function solidOpinionPostRendering() {
                  var base = $(this);

                  if (!$('div.so-reg-login', base).length) {
                    $('iframe', base).before(self.nav.clone());
                    mngr.user.getInfo(function() {}); //sync
                  }
                });
              });
            })();
          }

          function solidOpinionUpdateUsername(update) {
            var username = user.getUsername(), current = $('[data-reg-username]', self.nav);
            update != null && current.attr('data-reg-text') != username && so.callAction( update ? 'update-user-profile' : 'login-tronc-user' );
            current.add('div.so-reg-login [data-reg-username]').attr('data-reg-text', username);
          }
          function solidOpinionAttemptComment(action, pause) {
            verify.wait = function() {
              !pause && so.callAction('suspend-user-' + ( pause = action ? 'action' : 'login' ));
              $('html').focus(); //so iframe
            };
            verify.play = function() {
              pause && so.callAction('resume-user-' + pause + ( action ? '' : '-with-tronc' ));
            };
            verify.stop = function() {
              pause && so.callAction('cancel-user-' + pause);
            };

            evnt.fire('reg_before_comment', verify);
            !verify.intercept && verify();

            function verify() {
              if (user.isLoggedIn()) confirmUserName(); else {
                evnt.next('reg_close_login', confirmUserName);
                verify.wait();

                mngr.showRegistrationDialog({
                  events: {
                    onClose: function(auto) {
                      !auto && verify.stop();
                    }
                  }
                });
              }

              function confirmUserName() {
                mngr.user.getInfo(function() {
                  if (user.nameConfirmed()) {
                    solidOpinionUpdateUsername();
                    verify.play();
                  } else {
                    mngr.showNameInterceptDialog(verify);
                    verify.wait();
                  }
                });
              }
            }
          }
        }, { 'sopublic.solidopinion.com': 'd', 'tcd.solidopinion.com': 'd', 'duzt8zhfirl2o.cloudfront.net': 'dp' });
      }
    };

    vendor.omniture = {
      track: function(event) {
        var inputs = Array.prototype.slice.call(arguments, 1, arguments.length), omni = vendor.omniture, self = this;

        useomni && (function init() {
          if (window.s) {
            var mAID = conf.get('metricsAccountId'), omn = (function inherit(e) {
              var event = omni.events[e];
              return $.extend(true, event.parent ? inherit(event.parent) : {}, event);
            })(event);

            mAID && s.sa(mAID);
            $.extend(s, s.slug ? {} : ( s.getPageVars ? s.getPageVars() : { contentType: s.prop38, slug: s.prop44 } ), omn.props);

            $.each(omn.input || [], function(i, prop) {
              s[prop] = inputs[i];
            });
            $.each(omn.props, function(prop, val) {
              if (/^s\./.test(val)) s[prop] = s[val.substr(2)];
            });

            s.tl( self != omni ? self : true , 'o', s.prop57);
          } else ( 'limit' in init ? --init.limit : init.limit = 100 ) && setTimeout(init, 250);
        })();
      },
      events: {
        base: {
          props: {
            linkTrackEvents: 's.events', prop38: 's.prop57', eVar65: 's.channel', eVar66: 's.pageName', eVar67: 's.contentType'
          }
        }
      }
    };

    vendor.googleanalytics = {
      track: function(event, data) {
        usega && (function init() { //or s-polling failed?
          if (window.ga) {
            var gan = vendor.googleanalytics.events[event];
            data = $.extend({ dimension112: 'tracker' }, data);
            if (gan.metric) data['metric' + gan.metric] = 1;
            ga('trb.send', 'event', 'DSS', gan.label, data);
          } else ( 'limit' in init ? --init.limit : init.limit = 100 ) && setTimeout(init, 250);
        })();
      },
      events: {
        profile: { label: 'account nav click', metric: 70 },
        newsletter: { label: 'newsletter nav click', metric: 69 }
      }
    };

    vendor.mather = {
      track: function(event, data) {
        (window._matherq || (_matherq = [])).push(['paywallEvent', $.extend(data, vendor.mather.events[event])]);
      },
      setUser: function() {
        mngr.user.get(function() {
          $.extend(trb.data.user || (trb.data.user = {}), {
            userId: user.getConsumerId() || null,
            zipCode: user.getZipCode() || null,
            email: user.getEmailAddress() || null
          });
        });
      },
      events: {}
    };
  })();

  (function initMetrics() {
    var track = 'events,server,prop28,prop33,prop34,prop57,prop62,prop74,eVar20,eVar21,eVar34,eVar35,eVar36,eVar37,eVar38,eVar39,eVar51',
      goan = trb.vendor.googleanalytics, omni = trb.vendor.omniture, mthr = trb.vendor.mather, props = omni.events.base.props, navprops = { linkTrackVars: track + ',prop1,prop20' };

    reg.getMetricsId = user.getConsumerId; //legacy
    omni.src = props.eVar54 = 'digital subscription panel';
    $.extend(navprops, props); props.eVar21 = 's.prop57';
    evnt.on('reg_after_login', mthr.setUser);
    evnt.on('reg_after_logout', mthr.setUser);
    mthr.setUser();
    $(function() {
      // on page load, so site can populate trb.data first
      var mid = conf.get('matherMarketId');
      // mather_load will be true if ngux/orca loads mather. TODO: remove when they load for all sites(ngux, orca, mg2, member center, marketing landing pages, etc)
      !trb.vendor.mather_load && mid && !window.location.hostname.match(/\.p2p\./) && (trb.vendor.mather_load = true) && loadMather(mid);
          
      function loadMather(marketid) {
        var ml = document.createElement('script'), s = document.getElementsByTagName('script')[0] || document.head, cb;
        try { if (!(cb = localStorage._matherVer)) throw false; }
        catch (e) { cb = Math.round(new Date() / 1.0368e9); }
        ml.type = 'text/javascript'; ml.async = true; ml.defer = true; ml.id = '_mljs'; ml.src = '//js.matheranalytics.com/s/ma89701/' + marketid + '/ml.js?cb=' + cb;
        s.parentNode.insertBefore(ml, s);
      }
    });

    $.extend(omni.events, {
      navbar: { props: navprops },
      profile: { parent: 'navbar', props: { prop57: 'navbar click profile', events: 'event82' } },
      newsletter: { parent: 'navbar', props: { prop57: 'navbar click newsletters', events: 'event83' } },
      comment: { parent: 'base', props: {
        linkTrackVars: track + ',eVar7,eVar28,eVar40,eVar68', prop57: 'comment', events: 'event7',
        eVar21: 's.contentType', eVar34: 's.channel', eVar35: 's.pageName', eVar36: 's.slug'
      }}
    });

    evnt.on('reg_after_comment', function() {
      omni.track('comment');
    });
    evnt.on('reg_handler_click', function(link) {
      var which = (link.handler || '').replace('Handler', '');
      omni.src = $(link).closest(conf.get('nav2Selector')).length ? 'navbar2' : ( $(link).closest('.so-reg-login').length ? 'comment' : omni.src );

      if (/profile|newsletter/.test(which)) {
        omni.track(which);
        goan.track(which);
      }
    });
  })();

  util.poll('body', function start() {
    evnt.on('reg_after_logout', function(pending) {
      pending ? conf.set('successfulLoginRedirect', '${refresh}') : util.redirectUser(loc.href);
    });

    reg.nav._update();
    var params = (util.querys = util.url.get)(loc); //legacy
    user.getTos() == 'false' && mngr.user.logout(); //no ls: fail/query
    if (params.masterID || params.linked || params.linkMasterId || params.linkProvider) mngr._load(function() { util.modalClose(params); }); // webview (no popup)
    else if (params.h_token) mngr.showPasswordResetDialog({ tokens: params });
    else if (params.modal) reg.showDialog(params.modal);
    else if (conf.get('authServer')) {
      // iframeITP cookie sync is pointless
      if (!util.iframeITP && (util.cookies.get('c_mId') === undefined || util.cookies.get('c_PUID') === undefined)) mngr.user.syncLoginCookies();
    }

    trb.userTiming('reg before push');
    reg.push.apply(reg, ready);
    trb.userTiming('reg after main');
  });
}

  })({"svg_nav_profile":"<svg class=\"icon-light\"><use xlink:href=\"#user-circle-o\"></use></svg>","reg_product_code":"chiarc","reg_metrics_account_id":"tribarcdev","reg_nav2_selector":"#app-bar","reg_successful_login_redirect":"${refresh}","same_site_cookie":"true","reg_signup_url":"http://qa.tribpubdev.com/ct/land-subscribe-evergreen/?returnUrl=${return}","auth_server":"https://authenticate.chicagotribune-stage.trbdevcloud.com","reg_nav_profile_url":"https://membership.chicagotribune-stage.trbdevcloud.com/profile","reg_cookie_domain":".chicagotribune-stage.trbdevcloud.com","reg_newsletter_url":"https://membership.chicagotribune-stage.trbdevcloud.com/newsletters","reg_ssor_base_url":"ssor.trb.stage.tribdev.com","reg_hostname":"https://tribune.ssor.stage.trbdevcloud.com","reg_enable_omniture":"true","reg_nav_container_selector":"[data-reg-role~=base], #memberLoginInfo","reg_mather_market_id":"197837699","ada_content_root":".pb-root","reg_nav_sign_in_text":"Log In","reg_nav_newsletters_text":"Newsletters","reg_nav_sign_out_text":"Sign Out","reg_nav_sign_up_text":"Sign Up","reg_nav_profile_text":"Profile","ada_aria_hidden":".met-flyout,#pb-root,.x-container"});
})();
