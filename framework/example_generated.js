if (!window.trb) trb = {};
if (trb.userTiming) trb.userTiming('met before main');
else trb.userTiming = function() {};

(function bootstrapMetering(conf) {
  (trb.registration || (trb.registration = [])).push(function(reg) {
    trb.userTiming('met after ssor');

    var confBase = { // will overwrite same-named SSOR keys
      dssProduct: conf.product,
      market: conf.market,
      dssBaseUrl: 'dss-recurly.stage.tribops.com' || 'www.tribdss.com',
      userAgentPattern: conf.userAgentPattern || /^$/,
      nlTokenPattern: conf.nlTokenPattern || /^$/,
      international: conf.internationalEnabled,
      displaySubscribeButton: conf.displaySubscribeButton || '',
      systemCheck: '_healthy', normalMeter: '_personal', normalReact: '_domestic', // asset toggles
      meteringCSS: 'html[data-dss-meterup],[data-dss-meterup] body{overflow:hidden}',
      reactionJS: 'chckout002-reaction-1q2w3-833773751174236933.js',
      rules: conf.rules || [],
      subLevels: conf.subscriptionLevels,
      ccDecline: {
        resetPeriodInitial: conf.ccdResetPeriodInitial,
        resetPeriodFinal: conf.ccdResetPeriodFinal
      },
      adblock: {
        browsers: conf.adblockBrowsers,
        googletag: conf.adblockGoogletag,
        classes: conf.adblockClasses || ''
      },
      cepEnabled: conf.cepEnabled,
      swgEnabled: conf.swgEnabled
    };

    if('meterResetDays' in conf) {
      confBase.meterResetDays = conf.meterResetDays;
    } else {
      if(!reg.utils.cache('trb.metering.meterSplitTest', function(data) {
        confBase.meterResetDays = data.days;
      }, 180)) {
        confBase.meterResetDays = function(json) {
          var list = JSON.parse(json),
              rand = Math.random(),
              sum = 0;
          
          for(var i = 0; i < list.length; i++) {
            sum += list[i].probability * .01;
            if(rand <= sum) {
              reg.utils.cache('trb.metering.meterSplitTest', list[i]);
              return list[i]; //  object with days & probability
            }
          }
        }(conf.meterResetSettings).days;
      }
    }

    initMetering(reg, confBase);

    /* now with layouts */

function initMetering(reg, config) {
  var $ = reg.jQuery, ready = trb.metering || [], loc = window.location, ua = navigator.userAgent,
    conf = reg.config, evnt = reg.events, util = reg.utils, user = reg.user, mngr, rules = { shown: [], pairs: {} }, paths;

  var met = trb.metering = trb.meteringService = { version: 2 };

  const ccDRespKey = "trb.metering.ccd.subData",
        ccDDataKey = "trb.metering.ccd.meterData",
        meterDataKey = "trb.metering.meterData",
        subStatusKey = "trb.metering.subData.status";

  config.metPath = config.dssBaseUrl.replace(/\/?$/, '/subscriptions/');
  conf.set(config);

  $.extend(util, {
    page: {
      freeze: function(wall) {
        var body = $('body').on('touchstart', util.page.nodrag);
        $('html').attr('data-dss-meterup', '').keydown(util.page.notype);
        $(window).on('scroll orientationchange', util.page.nomove).scroll();
        wall && !$('#reg-overlay').length && body.append('<div id="reg-overlay" />');
      },
      thaw: function() {
        $('#reg-overlay').remove();
        $('body').off('touchstart', util.page.nodrag);
        $(window).off('scroll orientationchange', util.page.nomove);
        document.querySelectorAll(reg.config.get('adaARIAHidden') || '#pb-root').forEach(function(e) { e.removeAttribute('aria-hidden') });
        $('html').removeAttr('data-dss-meterup').removeAttr('data-ssor-modalup').off('keydown', util.page.notype);
      },
      nomove: function() {
        scroll(0, util.page.top);
      },
      notype: function(e) {
        !$(e.target).is(':input') && e.which > 31 && e.which < 41 && e.preventDefault();
      },
      nodrag: function(e) {
        if (util.page.touch == null) {
          var body = $(this).on('touchmove', unmove).on('touchend touchcancel', undrag), move,
            dialog = $(e.target).closest('.reg-dialog'), ref = util.page.touch = e.originalEvent.touches[0].screenY;

          if (dialog.length) {
            var top = dialog.scrollTop(), btop = body.scrollTop(), dtop = dialog.offset().top,
              height = dialog.outerHeight(), phone = body.outerWidth() < 550; move = true;

            if ( phone ? top == dialog[0].scrollHeight - height : dtop + height <= btop + $(window).height() ) move = 'up';
            if ( phone ? !top : dtop >= btop ) move = move != 'up' && 'dn';
          }
        }

        function unmove(e) {
          $.each(e.originalEvent.changedTouches, function(i, tap) {
            if (/up|dn/.test(move) && tap.screenY != ref) move = (move == 'dn' && tap.screenY < ref) || (move == 'up' && tap.screenY > ref);
          });

          !move && e.preventDefault();
        }

        function undrag(e) {
          if (!e.originalEvent.touches.length) {
            body.off('touchmove', unmove).off('touchend touchcancel', undrag);
            delete util.page.touch;
          }
        }
      }
    },
    checkExpiry: function(key, resolve, refresh) {
      this.cache(key, function(data) {
        data.ssorId == user.getMasterId() && data.expirationDate > new Date().getTime() ? resolve(data) : refresh();
      }, 7) || refresh();
    },
    inList: function(find, list) {
      var search = $.makeArray(find), i;

      for (i = 0; i < search.length; i++) {
        if (~(list || '').search('(^|,|!)' + search[i] + '(,|$)')) return true;
      }

      return false;
    },
    specialMeter: function(which, callback) {
      callback && evnt.next('met_after_meter', function() {
        callback(rules.shown.slice(-1)[0]);
      });

      met.meter({ resolved: loc.host + '/override/' + which + '#' + loc.pathname });
    },
    getFormattedDate: function(date) {
      return date.getFullYear() + '-' + util.getFormattedMonth(date) + '-' + util.getFormattedDay(date)
    },
    getFormattedMonth: function getMonth(date) {
      return ((date.getMonth() + 1) < 10) ? ('0' +(date.getMonth() + 1)) : (date.getMonth() + 1);
    },
    getFormattedDay: function getDay(date) {
      return (date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate();
    },
    cacheData: function cacheData(meterData) {
        util.cache(meterDataKey, meterData);
     }
  });

  met.ajax = {
    getSubscriberData: function(options) {
      var callback = options.callback;

      options.callback = function(subs) {
        if (!subs.expirationDate) subs.expirationDate = new Date().getTime() + 900000;
        checkSubStatus(subs.subscriptionLevels);
        util.cache('trb.metering.subData', subs);
        callback(subs);

        function checkSubStatus(userSubLevels) {
          const subStatus = localStorage.getItem(subStatusKey),
                prodSubLevels = conf.get('subLevels') || '';
          let wasSub;
          try { 
            const subStatusData = JSON.parse(subStatus || '{}') || {};
            if(subStatus !== null) wasSub = subStatusData.formerSubscriber;
          } catch(er) {}
          const curSub = userSubLevels.length > 0 && prodSubLevels.split(',').filter(value => userSubLevels.includes(value)).length > 0;
          
          if( ((wasSub === undefined) && curSub) || ((wasSub === false) && !curSub) || ((wasSub === true) && curSub) ) util.cache(subStatusKey, { formerSubscriber: !curSub });
          // Don't change or add cache for the other cases
        }
      }  
      this._send(options, {path: 'zephr', data: {dss_product: conf.get('dssProduct')}});
    },

    getCreditCardDeclineSubCheck: function(options) {
      var callback = options.callback,
          ccdConf = options.ccdConfig;

      options.callback = function(resp) {
        util.cache(ccDRespKey, resp);
        callback(resp);
      };

      // TODO: change this to Promises with async and await

      this._send(options, {url: 'ccd', path: 'check'});
    },
    getFBPersistLogin: function(options) {
      const canonicalURL = loc.href.split('?')[0]
      var callback = options.callback;
      options.callback = function(resp) {
        resp.url = canonicalURL;
        callback(resp);
      };
      const fb_news_token = new URLSearchParams(loc.search).get('fb_news_token');
      if(fb_news_token) this._send(options, {url: 'facebook', path: 'fb_persist_login', data: {fb_news_token: fb_news_token, canonicalURL: canonicalURL}});
    },

    _send: function(handlers, inputs) {
      reg.ajax._send(handlers, $.extend(true, inputs, {
        prefix: '//' + conf.get('metPath'),
        url: 'user' + ( inputs && inputs.url ? '/' + inputs.url : '' ) + '/' + conf.get('market') +  (inputs && inputs.path ? '/' + inputs.path : '' ),
        data: {
          ssor_id: user.getMasterId()
        }
      }));
    }
  };

  (function initNavigation() {
    $.extend(met, {
      getStatus: function(callback) {
        mngr.user.subscriptions(function(subs) {
          mngr.user.track(function(meterData) {
            callback({ subscriptionLevels: subs, usePaths: paths, matchedRule: rules.shown.slice(-1)[0], matchedRules: rules.shown, cohorts: meterData.cohorts });
          })
        });
      },
      showReaction: function(rule, which) {
        mngr.user.track(function(meterData) {
          rule = $.extend({ i: 0 }, rule.i ? rule : findRule(rule));
          var update = which === true,
              page = paths.content.split('#')[0],
              limit = rule.l,
              method = true,
              stop = rule.a[0],
              rid = rule.i,
              pair = rules.pairs,
              pnum = pair[rid] || pair[stop],
              cuD = new Date(), // current date
              cuFD = util.getFormattedDate(cuD),
              resetDays = conf.get('meterResetDays'),
              lowerBoundaryDate = util.getFormattedDate(new Date(cuD.getFullYear(), cuD.getMonth(), 1)), // calendar by default
              ruleExtension = {
                n: 0
              };

              meterData.ruleHistory[cuFD] = meterData.ruleHistory[cuFD] || {};
              meterData.ruleHistory[cuFD][rid] = meterData.ruleHistory[cuFD][rid] || { n: 0 }; //initialize ruleHistory

              if (resetDays > '0') {
                // first rule view date
                if (!meterData.meterStartDate || (cuD.getTime() - parseInt(resetDays)*86400000) > new Date(meterData.meterStartDate))
                  meterData.meterStartDate = new Date();

                var meterStartDate = new Date(meterData.meterStartDate);

                lowerBoundaryDate = util.getFormattedDate(meterStartDate);
              } else if (resetDays < '0') {
                lowerBoundaryDate = util.getFormattedDate(new Date(cuD.getTime() - Math.abs(resetDays)*86400000));
              }

              $.each(meterData.ruleHistory, function(date, ruleData) {
                if (inBoundary(date))  {
                  ruleExtension.n += (ruleData[rid] && ruleData[rid].n ? ruleData[rid].n : 0);
                  ruleData[rid] && ruleData[rid].d && (ruleExtension.d = ruleData[rid].d);
                }
              });

          $.extend(rule, ruleExtension);
          if (rule.g) rule.l += rule.g; // g|ained

          if (update && rule.p) !(rule.p in pair) && (pair[rule.p] = rule); else { //p|air
            if (update && pnum) {
              rule = $.extend(pnum, { n: rule.n, m: rule.m });
              if ('l' in rule && limit) rule.l += limit;
            }

            var bypass = conf.get('international'), about = rule.a.split(','); // a|bout
            if (update || !which) which = 'l' in rule && rule.n >= rule.l ? 'exceed' : 'within';
            method = (rule.e = { category: about[1], within: about[2], exceed: about[3], abandon: about[4] })[which];
            $.extend(rule.e, { view: 0, shown: which, dialog: method == 'showPanel' || method == 'showModal' }); // e|nsighten

            if (!update) rule.f = true; else { // f|orce
              if (limit && meterData.pageHistory[page] && inBoundary(meterData.pageHistory[page])) method = null;
              else if (which == 'exceed') rule.b = true; else { // b|lock 
                if (limit || rule.m == 'referrer') {
                  meterData.pageHistory[page] = cuFD;
                }
                meterData.ruleHistory[cuFD][rid].n++; // increment rule count
                rule.e.view = 1; ++rule.n;// n|umber
                purgeData(); // done only once per day
                util.cacheData(meterData);
                if ((rule.v && !util.inList(rule.n, rule.v)) || rule.d) method = null; // v|iews, d|ismissed
                if (((rule.c === "ccDeclineInitial")  || (rule.c === "ccDeclineFinal")) && hideCCD()) method = null; // only do the cehck for ccd related rules
              }
              if (!conf.get('normalReact') && bypass) {
                if (rule.e.dialog && bypass !== true) $.extend(rule, { title: bypass, layoutID: 0, layout: '<div><a href="#" class="reg-cancel">Return</a></div>' }); 
                else method = null;
              }

              rules.shown.push(rule);
              if (!method) rule.e.shown = '';
              evnt.fire('met_rule_matched', rule);
            }
          }
          if (method in mngr) {
            rule.b && util.page.freeze(rule.e.dialog);
            mngr[method](rule, which);
          }

          if (update) stop == '!' ? evnt.fire('met_after_meter', rule) : met.meter(true);
              
          function purgeData() {
            if (!meterData.cleanHistory || meterData.cleanHistory != cuFD) {
              var keepDays = 180,
                  formattedBoundaryFromToday = util.getFormattedDate(new Date(cuD.getTime() - keepDays*86400000));

              $.each(meterData.pageHistory || {}, function(page, date) {
                if (date < formattedBoundaryFromToday) delete meterData.pageHistory[page];
              });

              $.each(meterData.ruleHistory || {}, function(date) {
                if (date < formattedBoundaryFromToday) delete meterData.ruleHistory[date];
              });
              if (util.getFormattedDate(new Date(meterData.session)) < formattedBoundaryFromToday) {
                delete meterData.session;
                delete meterData.referrer;
              }
              meterData.cleanHistory = cuFD;
            }
          }
              
          function inBoundary(date) {
            return (date >= lowerBoundaryDate);
          }      
            
          function hideCCD(status = false) {
            const cuD = new Date(),
                  cuFD = cuD.toString(),
                  initialResetPeriod = parseInt(conf.get('ccDecline').resetPeriodInitial) * 86400000, // to milli seconds
                  finalResetPeriod = parseInt(conf.get('ccDecline').resetPeriodFinal) * 86400000; // to milli seconds
            
              // returning false shows the toaster. true hides the toaster
            let ccdHistory = localStorage.getItem(ccDDataKey);
            ccdHistory = (ccdHistory && JSON.parse(ccdHistory)) || { expirationDate: (cuD.getTime() +  86400000*180), cachedDate: cuD.getTime(), ssorId: user.getMasterId()}; // 180 days for expiration
                  

            const initialToasterData = (ccdHistory['initial'] && (Object.values(ccdHistory['initial']).length > 0) && Object.values(ccdHistory['initial'])[0]),
                  finalToasterData = (ccdHistory['final'] && (Object.values(ccdHistory['final']).length > 0) && Object.values(ccdHistory['final'])[0]);

              // show/hide initial toaster reset period based on below conditions

              // case 1: initial or final toaster not shown earlier - first visit - show initial toaster with initial toaster start date as current date

              // No interaction cases - will not have end date for this in localstorage, final toaster not yet shown
              // case 2: initial toaster start time < current time < initial toaster start time + initial reset period(resetPeriodInitial) - initial toaster not closed - show initial toaster
              // case 3: initial toaster start time + resetPeriodInitial < current time - Show final toaster, keep the initial toaster end time for initial toaster as initial toaster start time + resetPeriodInitial 

              // interaction cases - initial toaster interacted with. will have end date for this in localstorage. final toaster not yet shown
              // case 4: initial toaster start time < current time < initial toaster start time + initial reset period(resetPeriodInitial) - initial toaster interacted, still in initial reset period - Don't show anything
              // case 5: initial toaster start time + resetPeriodInitial < current time - show final toaster, keep the final toaster start time as current time

              // show/hide final toaster reset period based on below conditions 

              // case 3 and 5 should trigger final toaster with final toaster start time as current time

              // No interaction cases - final toaster not closed yet. will have start date
              // case 7: final toaster start time < current time < final toaster start time  + resetPeriodFinal - show final toaster 
              // case 8: final toaster start time  + resetPeriodFinal < current time < final toaster start time  + resetPeriodFinal + resetPeriodFinal - hide the final toaster, keep the end time as final toaster start time  + resetPeriodFinal 
              // case 9: final toaster start time  + resetPeriodFinal + resetPeriodFinal < current time - reset the existing entries, show toaster with start time as current time - cycle reset

              // interaction cases - final toaster interacted with. will have end date for this in localstorage. 
              // case 10: final toaster end time < current time < final toaster end time + resetPeriodFinal - don't show toaster
              // case 11: final toaster end time + resetPeriodFinal < current time - reset the existing entries, show toaster with start time as current time - cycle reset


              if ((rule.c === "ccDeclineInitial") && rule.d) {
                  // case 4 and case 5
                  status = true; // don't show the initial toaster again
              } else if (rule.c === "ccDeclineInitial") {

                  if (initialToasterData) { // case 2, 3, 4
                      const initToasterStartDateStr = ccdHistory['initial'][rule.i] && ccdHistory['initial'][rule.i]['start'];
                      if (initToasterStartDateStr) {
                          let startDate;
                          try {
                              startDate = new Date(initToasterStartDateStr);
                          } catch (er) {
                              startDate = cuD;
                          }
                          if (startDate.getTime() < cuD.getTime()) {
                              if (cuD.getTime() < startDate.getTime() + initialResetPeriod) {
                                  // case 2 - status = false - default value
                              } else if (startDate.getTime() + initialResetPeriod < cuD.getTime()) {
                                  // case 3.  don't show initial toaster again
                                  status = true; 
                                  updateOrDeleteRuleHistory(rule, true);
                                  ccdHistory['initial'][rule.i]['end'] = (new Date(startDate.getTime() + initialResetPeriod)).toString();
                                  mngr.user.storeCCDData(ccdHistory, cuD);
                              }
                          } else {
                              // never happens
                              // status = false - default value
                          }
                      } else {
                          // initial toaster data exists but different initial toaster rule toaster
                          // show the initial toaster data
                          ccdHistory['initial'] = ccdHistory['initial'] || {};
                          ccdHistory['initial'][rule.i] = {start: cuFD}; // remove that older data
                          mngr.user.storeCCDData(ccdHistory, cuD);
                          // status = false - default value
                      }
                  } else {
                      // case 1
                      ccdHistory['initial'] = ccdHistory['initial'] || {};
                      ccdHistory['initial'][rule.i] = ccdHistory['initial'][rule.i] || {start: cuFD}; // first visit
                      mngr.user.storeCCDData(ccdHistory, cuD);
                      // status = false - default value
                  }
              } else if ((rule.c === "ccDeclineFinal") && rule.d) { // case 10 and case 11

                  if (ccdHistory['final']) {
                      const finalToasterEndDateStr = ccdHistory['final'][rule.i]['end'];
                      let closeDate;
                      try {
                          closeDate = new Date(finalToasterEndDateStr);
                      } catch (er) {
                          closeDate = cuD;
                      }
                      if (cuD.getTime() < closeDate.getTime() + finalResetPeriod) {
                          // case 10
                          status = true; // final reset period not crossed, don't show final toaster as it was already closed
                      } else if (closeDate.getTime() + finalResetPeriod < cuD.getTime()) {
                          // case 11  - reset final toaster entries
                          updateOrDeleteRuleHistory(rule, false);
                          ccdHistory['final'][rule.i] = {start: cuFD};
                          mngr.user.storeCCDData(ccdHistory, cuD);
                      }
                  } else {
                      // should never happen
                      // status = false; // show final toaster since we don't have information
                      updateOrDeleteRuleHistory(rule, false);// fix the rule history information
                      mngr.user.storeCCDData(ccdHistory, cuD);
                  }
              } else if (rule.c === "ccDeclineFinal") {
                  if (finalToasterData) { // cases 7, 8, 9
                      const finalToasterStartDateStr = ccdHistory['final'][rule.i] && ccdHistory['final'][rule.i]['start'];
                      // don't match if initial toaster is a match
                      // if (rules.shown.filter())
                      if (finalToasterStartDateStr) {
                          let startDate;
                          try {
                              startDate = new Date(finalToasterStartDateStr);
                          } catch (er) {
                              startDate = cuD;
                          }
                          if (startDate.getTime() < cuD.getTime()) {
                              if (cuD.getTime() < startDate.getTime() + finalResetPeriod) {
                                  // case 7
                                  // status = false - default value
                              } else if ((startDate.getTime() + finalResetPeriod < cuD.getTime()) && (cuD.getTime() < startDate.getTime() + 2 * finalResetPeriod)) {
                                  // case 8
                                  status = true; // don't show final toaster
                                  updateOrDeleteRuleHistory(rule, true);
                                  ccdHistory['final'][rule.i]['end'] = (new Date(startDate.getTime() + finalResetPeriod)).toString();
                                  mngr.user.storeCCDData(ccdHistory, cuD);
                              } else if (startDate.getTime() + 2 * finalResetPeriod < cuD.getTime()) {
                                  // case 9
                                  deleteOrDeleteRuleHistory(rule, false);
                                  ccdHistory['final'] = {start: cuFD}; // remove that older data and reset the toaster. show the final toaster
                                  mngr.user.storeCCDData(ccdHistory, cuD);
                              }
                          } else {
                              // never happens
                              // status = false - default value
                          }
                      } else {
                          // final toaster data exists but different final toaster rule toaster
                          // show the final toaster
                          updateOrDeleteRuleHistory(rule, false);
                          ccdHistory['final'] = {start: cuFD}; // remove that older data
                          mngr.user.storeCCDData(ccdHistory, cuD);
                          // status = false - default value
                      }
                  } else { 
                      // check if user is still in initial reset period 

                                // case 2: initial toaster start time < current time < initial toaster start time + initial reset period(resetPeriodInitial) - initial toaster not closed - show initial toaster
                // case 2: initial toaster start time < current time < initial toaster start time + initial reset period(resetPeriodInitial) - initial toaster not closed - show initial toaster
                // case 3: initial toaster start time + resetPeriodInitial < current time - Show final toaster, keep the initial toaster end time for initial toaster as initial toaster start time + resetPeriodInitial 
                // case 4: initial toaster start time < current time < initial toaster start time + initial reset period(resetPeriodInitial) - initial toaster interacted, still in initial reset period - Don't show anything
                // case 5: initial toaster start time + resetPeriodInitial < current time - show final toaster, keep the final toaster start time as current time

                      const initToasterStartDateStr = initialToasterData && initialToasterData['start']; // should exist
                      if (initToasterStartDateStr) {
                          let startDate;
                          try {
                              startDate = new Date(initToasterStartDateStr);
                          } catch (er) {
                              startDate = cuD;
                          }

                          if (startDate.getTime() + initialResetPeriod < cuD.getTime()) {
                            // case 3 and 5
                            // status = false, user crossed initial reset period and should show the final toaster.
                          } else if(cuD.getTime() < startDate.getTime() + initialResetPeriod) {
                             // case 2 and 4
                             // still in initial reset period. Don't show the final toaster yet
                             status = true;
                          }
                      } else {
                          // should not happen. initial toaster data does not exist
                          // don't show the final toaster
                          status = true;
                      }

                  }
              }

              function updateOrDeleteRuleHistory(r, val){
                if(val) mngr.user.store(r, 'd'); // use existing
                else mngr.user.track(function(meterData) { 
                  for (const key in meterData.ruleHistory) {
                    if (meterData.ruleHistory[key]) delete meterData.ruleHistory[key][rule.i]['d'];
                  }
                  util.cacheData(meterData);
                });
              }

              return status;
          }
     
          function findRule(id) {
            var search = conf.get('rules'), i;

            for (i = 0; i < search.length; i++) {
              if (search[i].i == id) return search[i];
            }
          }
        });
      },
      // TODO: Unexpectedly, once this function is available, any `met.push` calls execute immediately instead of waiting until met_after_meter (contrast with `ready` array).
      push: function() { //emulate Array.push
        var api = { status: met.getStatus, meter: met.meter, track: mngr.user.track,
          event: evnt.on, fire: evnt.fire, handle: util.specialMeter, show: met.showReaction };

        $.each($.makeArray(arguments), function(i, item) {
          if ($.isFunction(item)) item(met); else {
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

    var mainnav = conf.get('nav2Selector');
    $('head').append('<style>' + conf.get('meteringCSS') + '</style>');

    $.each(conf.get('displaySubscribeButton').split(','), function(i, button) {
      util.poll(button, function(name) {
        name.prepend('<a href="#" data-reg-handler="signUpHandler" data-reg-text="Subscribe" aria-label="Subscribe" class="non-subscriber"></a>');
        trb.userTiming('met after nav');
      });
    });
    mainnav && util.poll('[data-reg-rendered]', function(base) {
      if (base.length) {
        reg.nav.signUpHandler = override('subscribe', reg.nav.signUpHandler);
        reg.nav.toggleNavigation = override('account', reg.nav.toggleNavigation);
        base.prepend('<div data-reg-role="button_desktop" /><div data-reg-role="button_tablet" /><div data-reg-role="button_mobile" />').append('<div data-reg-role="navigation" />');
      }

      function override(which, callback) {
        return function() {
          var self = this;

          !$(this).parent().is(base) ? original() : util.specialMeter(which, function(rule) {
            if (!rule || !/override/.test(rule.u)) original();
          });

          function original() {
            callback.call(self);
          }
        };
      }
    }, mainnav);
  })();

  met.meter = function meter(next) {
    mngr.user.track(function(meterData) {
      var code = trb.data.dssOverrideLevelCode, refer = document.referrer, today = new Date, rule;

      if (next !== true) {
        if (conf.get('systemCheck') && conf.get('normalMeter') && !~ua.search(conf.get('userAgentPattern'))) rules = $.extend($.merge([], conf.get('rules')), { shown: next && next.resolved ? rules.shown : [] , pairs: {} });
        refer && !RegExp('//[^\.]*' + conf.get('cookieDomain').replace(/\./g, '\\.'), 'i').test(refer) && setSession(refer);
        var token = loc.href.match(conf.get('nlTokenPattern'));
        util.page.top = paths ? $('body').scrollTop() : 0;

        if (token) {
          setSession(loc.href);
          util.url.del(token[0], true);
        }

        paths = next || {}; setPath('session', meterData.referrer); setPath('referrer', refer);
        setPath('content', loc.href); setPath('resolved', code ? loc.host + '/override/' + code + '#' + loc.pathname : paths.content );
      }
      if (rules.length && (rule = rules.shift())) { // i|d, s|ession, x|piry, u|rls, r|eferrers, l|imit, w|ithin, e|xceed
        if ((checkPath(rule.u, 'resolved') || checkPath(rule.r, 'referrer')) && (!rule.s || ((!rule.x || !meterData.session || today.setHours(today.getHours() - rule.x) < new Date(meterData.session)) && checkPath(rule.s, 'session'))))
          typeof rule.t == 'string' ? mngr.user.subscriptions(userSubs) : userSubs();
        else finish();
      } else evnt.fire('met_after_meter');

      function userSubs(subs) { // t|ype, c|allback
        if ( subs ? util.inList(subs, rule.t) == (rule.t[0] != '!') : rule.t === user.isLoggedIn() ) finish(); else rule.c ? mngr.user[rule.c](segments) : segments(true);
      }
      function segments(match) { // k|segments
        if (!match) finish(); else if (!rule['k']) finish(true); else if (meterData.cohorts.i) fallback();
        else { //reuse override
          var mather; try { mather = ( window.localStorage ? localStorage.getItem('_matherSegments') : (util.cookies.get('_matherSegments') || '') ).split(','); } catch (e) {}
          fallback(mather);
        }

        function fallback(value) {
          if (value) { //store now and later
            meter['k'] = meterData.cohorts['k'] = value;
            util.cacheData(meterData);
          } else value = meter['k'] || meterData.cohorts['k'];
          
          value ? segmentMatch(value) : finish();
        }

        function segmentMatch(resp) {
          var miss = true;

          $.each(rule.k.split(','), function(cont, set) {
            $.each(set.split('+'), function(i, item) {
              var test = util.inList(resp, item); if (/^!/.test(item)) test = !test;
              if (!test) return (cont = false); //break
            });

            if (cont !== false) return (miss = false); //break
          });
          finish(!miss);
        }
      }
      function finish(match) { // o|ccurance
        match && (!rule.o || checkRand()) ? met.showReaction(rule, rule.l && /ignoreMeteringLimit/.test(loc.href) ? 'exceed' : true ) : meter(true);
      }
      function checkRand() {
        if (!(rule.i in meterData.cohorts)) {
          var rand = (window.crypto || window.msCrypto);
          meterData.cohorts[rule.i] = ( rand ? rand.getRandomValues(new Uint8Array(1))[0] / 255 : Math.random() ) * 100 < rule.o;
          util.cacheData(meterData);
        }

        return meterData.cohorts[rule.i];
      }
      function checkPath(pattern, which) {
        var path = paths[rule.m = which]; if (~path.indexOf('#')) path += '\n' + path.split('#')[0]; if (~path.indexOf('?')) path += '\n' + path.split('?')[0]; // m|atch
        return pattern && new RegExp('^(' + pattern.replace(/(\*|\+)(\.|\/|\?)/g, '[^\\n$2]$1$2').replace(/\.|\?/g, '\\$&').replace(/([^\]]|^)(\*|\+)/g, '$1.$2').replace(/([^\*\+])(\||$)/g, '$1$$$2') + ')', 'im').test(path);
      }
      function setPath(which, def) {
        paths[which] = (paths[which] || def || '').replace(/^(https?:\/\/|#)/, '');
      }
      function setSession(url) {
        meterData.referrer = url;
        meterData.session = JSON.stringify(today).slice(1, -1);
        util.cacheData(meterData);
      }
    });
  };

  met.manager = mngr = {
    user: {
      store: function(rule, key, callback) {
          mngr.user.track(function(meterData) {
            var cuD = new Date(), cuFD = util.getFormattedDate(cuD),
                meterToday = meterData.ruleHistory[cuFD] = meterData.ruleHistory[cuFD] || {};

            meterToday[rule.i] = meterToday[rule.i] || { n: 0 };
            meterToday[rule.i][key] = callback ? callback(meterToday[key] || 0) : true;
            util.cacheData(meterData);
        });
      },
      storeCCDData: function(ccdHistory, currentDate) {
        // TODO: fix this to use existing api. Too lazy to do it now
        if( ccdHistory['expirationDate'] && (ccdHistory['expirationDate'] < currentDate.getTime()) ) {
          ccdHistory['expirationDate'] = currentDate.getTime() +  86400000*180; // 180 days for expiration
          ccdHistory['cachedDate'] =  currentDate.getTime(),
          ccdHistory['ssorId'] = user.getMasterId();
        } 
        localStorage.setItem(ccDDataKey, JSON.stringify(ccdHistory));
      },
      clearCache: function() {
        util.cache('trb.metering.subData');
      },
      clearSubStatus: function() {
        util.cache(subStatusKey);
      },
      track: function(callback) {
        var meterData = JSON.parse(localStorage.getItem(meterDataKey)),
            dateToday = new Date();
        callback(meterData || $.extend(conf.get('meterResetDays') > 0 ? {meterStartDate: dateToday} : {}, { cohorts: {}, pageHistory: {}, ruleHistory: {}, cleanHistory: util.getFormattedDate(dateToday) }));
      },
      subscriptions: function subs(callback, flush) {
        flush && this.clearCache();

        evnt.next('met_subs_queue', function(resp) {
          callback && callback(resp);
        });

        !user.isLoggedIn() ? resolve() : !subs.wait && util.checkExpiry('trb.metering.subData', resolve, function() {
          trb.userTiming('met subscription request');
          met.ajax.getSubscriberData({ callback: resolve });
          subs.wait = true;
        });

        function resolve(resp) {
          subs.wait && trb.userTiming('met subscription response'); 
          delete subs.wait;
          var levels = $.extend($.makeArray(resp && resp.subscriptionLevels), resp);
          resp && $('html').attr('data-reg-loggedin', levels.join(' '));
          evnt.fire('met_subs_queue', levels);
        }
      },
      ccDeclineInitial: function checkUser(callback, state = 'resetPeriodInitial') {
         // TODO: opimize this in future if we are still using this along with Zephr. For now, not feel like doing that. 
     
        evnt.next('met_ccd_queue', function(resp) { callback && callback(resp) });

        !user.isLoggedIn() ? resolve(false) : !checkUser.wait && util.checkExpiry(ccDRespKey, resolve, () => {
            trb.userTiming('met subscription request');
            met.ajax.getCreditCardDeclineSubCheck({ callback: resolve, resetState: state  });
            checkUser.wait = true;
        });

        function resolve(resp) {
          checkUser.wait && trb.userTiming('met ccd subscriber check response'); 
          delete checkUser.wait;
          const check = resp && resp.declined;
          evnt.fire('met_ccd_queue', check);
        }
      },
      ccDeclineFinal: function(callback) { mngr.user.ccDeclineInitial(callback, 'resetPeriodFinal') },
      mobile: function(callback) {
        //  fix for iPadOS Safari pretending to be a desktop
        const ipad = !!(navigator.userAgent.match(/(iPad)/) || (navigator.platform === "MacIntel" && typeof navigator.standalone !== "undefined"));
        callback(ipad || /(android|bb\d+|meego).+mobile|bada\/|blackberry|fennec|iemobile|ip(hone|od|ad)|kindle|maemo|midp|mmp|netfront|opera m|palm|phone|p(ixi|re)\/|series(4|6)0|symbian|up\.(b|l)|vodafone|wap|windows (ce|phone)|android|playbook|silk/i.test(ua));
      },
      adblock: function(callback) {
        var block = conf.get('adblock'), valid = true, tries = 3;
        if (block.browsers && ~ua.search(block.browsers)) callback(false); else if (navigator.onLine && window.googletag && block.googletag && modified()) callback(true); else util.poll('body', honeypot);

        function modified() {
          $.each(block.googletag.split(','), function(cont, set) {
            $.each(set.split('+'), function(i, item) {
              var test = googletag[item.replace(/\W/g, '')]; if (/\)$/.test(item)) test = test(); if (/^!/.test(item)) test = !test;
              if (!test) return (cont = false); //break
            });

            if (cont !== false) return (valid = false); //break
          });

          return !valid;
        }
        function honeypot(body) {
          if (!/interactive|complete/.test(document.readyState)) tries-- ? setTimeout(honeypot, 50) : callback(false); else {
            var trap = $('<div class="' + block.classes + '" style="display:block;position:absolute;top:-6666px;left:-6666px;border:0;width:2px;height:1px">&nbsp;</div>').appendTo(body), result = !trap[0].getBoundingClientRect().width;
            trap.remove() && callback(result);
          }
        }
      },
      privateMode: function(callback) {
        // does not work in IE 11 as it doesn't support ECMAScript 6
        var isPrivate, tries = 3;
        const ieMatch = /(?:MSIE|rv:)\s?([\d\.]+)/.exec(ua), pass = function() { isPrivate = false; }, fail = function() { isPrivate = true; };
        async function checkPrivate(callback) {
          if ((/Chrome/.test(ua) && window.webkitRequestFileSystem && /wv/.test(ua)) || (/wv/.test(ua) && /Android/.test(ua))){ // chrome or android webview
            isPrivate = false;
          } else if (/Chrome/.test(ua) && window.webkitRequestFileSystem && 'storage' in navigator && 'estimate' in navigator.storage) {  
            const { _, quota} = await navigator.storage.estimate(); // works in chrome 76 and older
            isPrivate = (quota < 120000000);
          } else if (/Firefox/.test(ua) && window.indexedDB) {
            let db = indexedDB.open('test'); // this may not work soon. https://bugzilla.mozilla.org/show_bug.cgi?id=1562669, https://bugzilla.mozilla.org/show_bug.cgi?id=781982, https://bugzilla.mozilla.org/show_bug.cgi?id=1506680
            db.onsuccess = pass; 
            db.onerror = fail;
          } else if (/Edge/.test(ua) || (ieMatch && parseInt(ieMatch[1], 10) >= 10)) {
            isPrivate = !window.indexedDB;
          } else if (/Safari/.test(ua) && window.localStorage) { // this does not work on safari 13
            try {
              isPrivate = !openDatabase(null, null, null, null);
              localStorage.setItem('test', 1); 
              localStorage.removeItem('test');
            } catch (e) { 
              isPrivate = true;
            }
          } else if ('private' in trb) {
            isPrivate = trb.private; // changed the order as this is set to false by arc site as they have not updated logic for firefox
          }

          (function retry() {
            if (isPrivate != null) {
              callback(trb.private = isPrivate); 
            } else {
              tries-- ? setTimeout(retry, 50) : callback(false);
            }
          })();
        }
        checkPrivate(callback);
      },
      directBill: function(callback) {
        mngr.user.subscriptions(function(subs) {
          callback(subs.printSubscriber && !subs.ezpaySubscriber);
        });
      }
    },
    showButton: function(rule) {
      rule.y && conf.set('signUpUrl', rule.y);
      evnt.fire('met_reaction_render', rule);

      util.poll('[data-reg-handler="signUpHandler"]', function(button) {
        button.attr('data-met-rule', rule.i);
      });
    },
    showFlyout: function(rule, which) {
      mngr._load('showFlyout', rule, which);
    },
    showPanel: function(rule, which) {
      mngr._load('showPanel', rule, which);
    },
    showModal: function(rule, which) {
      mngr._load('showModal', rule, which);
    },
    _load: function(method, rule, which) {
      util.script(met, 'reaction', conf.get('dssBaseUrl') + '/meter/assets/' + conf.get('reactionJS'), function() {
        which && $.extend(rule, conf.get('reactions')[which][rule.i || rule]);
        if(method == 'showPanel' || method == 'showModal')
          document.querySelectorAll(reg.config.get('adaARIAHidden') || '#pb-root').forEach(function(e) { e.setAttribute('aria-hidden', true) });
        (mngr[method] || method)(rule);
      });
    }
  };

  (function initMetrics() {
    ((trb.data || (trb.data = {})).user || (trb.data.user = {})).premium = '0';
    evnt.on('met_asset_fail', finish);

    evnt.on('met_rule_matched', function(rule) {
      if (!ensighten.data) {
        evnt.next('met_after_meter', ensighten);
        ensighten.rules = {}; ensighten.data = [];
      }

      if (rule.e.shown) ensighten.rules[rule.i] = ensighten.data.length; //map for reactions
      ensighten.data.push(rule.n + '^' + (rule.l || '') + '^' + rule._ + '^' + rule.e.view + '^' + ( rule.e.shown == 'within' ? rule.e.within : '' ) + '^' + ( rule.e.shown == 'exceed' ? rule.e.exceed : '' ) + '^^' + rule.e.category);
      rule.t && (rule.e.exceed == 'showPanel' || rule.e.exceed == 'showModal') && $.extend(trb.data.user, { premium: '1', metered: rule.n + '|' + rule.l });
    });
    evnt.on('met_reaction_render', function(rule) {
      finish(rule, rule.layoutID && conf.get('layouts')[rule.layoutID].name);
    });

    function pulse95() {
      var rules = ensighten.data.join('~');
      util.cache('trb.metering.meterSplitTest', function(d) { rules += ('`resetDays:[' + d.days + ']') }, 180);
      return rules;
    }

    function ensighten() { //send when layouts resolved
      Object.keys && Object.keys(ensighten.rules).length ? setTimeout(ensighten, 50) : mngr.user.subscriptions(function(subs) {
        (trb.dpp || (trb.dpp = [])).push({ pulse79: 'DSS metering', pulse95: pulse95(), pulse96: subs.length ? 'subscriber' : 'non-subscriber' });
        delete ensighten.data;
      });
    }
    function finish(rule, name) {
      if (ensighten.data && rule.i in ensighten.rules) {
        var id = ensighten.rules[rule.i], row = ensighten.data[id].split('^');
        if (!name) row[4] = row[5] = ''; row[6] = name || '';
        ensighten.data[id] = row.join('^');
        delete ensighten.rules[rule.i];
      }
    }
  })();

  (function initSwg() {
    // detect ld+json
    if (conf.get('swgEnabled') && $('script[type="application/ld+json"][data-schema="NewsArticle"]').length) loadSwg();
    function loadSwg() {
      var swgUrl = 'news.google.com/swg/js/v1/swg.js';
      util.script(window, 'swg', swgUrl);

      var jsonLd = JSON.parse($('script[type="application/ld+json"][data-schema="NewsArticle"]').text()),
        productID = jsonLd.isPartOf && jsonLd.isPartOf.productID || '';

      var signInUser = function(profile) {
        reg.user.importUserData(profile);
        reg.manager._load('setCookies', () => loc.reload());
      };

      var ensightenTrack = function(params) {
        (trb.dpp || (trb.dpp = [])).push(params);
      };
      
      var gaTrack = function(funcs) {
        if (window.ga) {
          ga('trb.require', 'ec');
          ga('trb.ec:addProduct', {               
            id: conf.get('swgSKU'),
            name: productID,
            category: 'subscription',
            variant: 'Subscribe with Google',          
            brand: conf.get('market')
          });
          for (var i = 0; i < funcs.length; i++) funcs[i]();
        }
      };

      var linkToMg2 = function(profile, offer, purchaseData) { // offer as plan_id|promotion_id
        let createSubData = {
          ssor_id: profile.masterId,
          email: profile.email,
          receiptStore: 'google',
          market_code: conf.get('market')
        };
        if (conf.get('cepEnabled')) {
          const [receiptOfferId, receiptOfferGroupId] = offer.split('|');
          Object.assign(createSubData, {
            receiptOfferId,
            receiptOfferGroupId,
            receiptData: purchaseData
          });
        } else {
          Object.assign(createSubData, {
            receiptProductId: offer,
            receiptData: JSON.parse(purchaseData).purchaseToken
          });
        }
        return $.post(`${loc.protocol}//${conf.get('metPath')}registration/create/${conf.get('market')}`, createSubData);
      };

      (self.SWG = self.SWG || []).push(subscriptions => {
        // Entitlements flow
        subscriptions.setOnEntitlementsResponse(entitlementsPromise => {
          entitlementsPromise.then(entitlements => {
              if (entitlements.enablesThis() && !user.isLoggedIn()) {
                // find a google purchase token
                var googleEntitlement = entitlements.entitlements.find(ent => ent.source === 'google');
                if (googleEntitlement && Object.prototype.hasOwnProperty.call(googleEntitlement, 'subscriptionToken')) {
                  var subscriptionToken = JSON.parse(googleEntitlement.subscriptionToken);
                  var purchaseToken = subscriptionToken.purchaseToken;
                }
                var accountPromise;
                if (purchaseToken) {
                  accountPromise = $.post(
                    loc.protocol + '//' + conf.get('ssorBaseUrl') + '/swg/findconsumer',
                    { purchase_token: purchaseToken, product_code: conf.get('productCode') }
                  );
                } else {
                  accountPromise = new Promise((resolve) => resolve({})); 
                }
                subscriptions.waitForSubscriptionLookup(accountPromise).then(accountResponse => {
                  if (accountResponse) {
                    subscriptions.showLoginPrompt().then(() => {
                      subscriptions.showLoginNotification().then(() => {
                        if ('masterId' in accountResponse) {
                          signInUser({ masterId: accountResponse.masterId });
                        } else {
                          reg.push('show-login');
                        }
                      });
                    },
                    () => { /* no-op */ });
                  }
                }, () => {
                  if (purchaseToken) {
                    subscriptions.completeDeferredAccountCreation({
                      entitlements: entitlements,
                      consent: true
                    }).then(accountCreationResponse => {
                      var idToken = accountCreationResponse.userData.idToken;
                      if (!idToken) return;

                      $.post(
                        `${loc.protocol}//${conf.get('ssorBaseUrl')}/swg/tokensignin`,
                        { id_token: idToken, product_code: conf.get('productCode'), purchase_token: purchaseToken },
                        ssorUserProfile => {
                          if (!('masterId' in ssorUserProfile)) return;
                          function handleMg2Link(reactions) {
                            // parse offer
                            const reactionsWithin = reactions.within;
                            let offerId;
                            for (let property in reactionsWithin) {
                              if (Object.prototype.hasOwnProperty.call(reactionsWithin, property)) {
                                if (Object.prototype.hasOwnProperty.call(reactionsWithin[property], 'swg_offerid')) {
                                  offerId = reactionsWithin[property]['swg_offerid'];
                                  break;
                                }
                              }
                            }

                            (function tryMg2Link(retries, delay) {
                              linkToMg2(ssorUserProfile, offerId, googleEntitlement.subscriptionToken)
                              .done(() => {
                                accountCreationResponse.complete().then(
                                  () => signInUser(ssorUserProfile),
                                  () => { /* no-op */ }
                                );
                              })
                              .fail(() => {
                                if(retries > 0) {
                                  setTimeout(function() {
                                    tryMg2Link(--retries, delay);
                                  }, delay);
                                } else {
                                  accountCreationResponse.complete().then(
                                    () => signInUser(ssorUserProfile),
                                    () => { /* no-op */ }
                                  );
                                }                                
                              });
                            })(3, 1000);
                          }
                          if (conf.get('reactions')) {
                            handleMg2Link(conf.get('reactions'));
                          } else {
                            util.script(met, 'reaction', `${conf.get('dssBaseUrl')}/meter/assets/${conf.get('reactionJS')}`, () => {
                              handleMg2Link(conf.get('reactions'));
                            });
                          }
                      }
                      );
                    }, () => {});
                  }
                });
                entitlements.ack();
              }
          }, () => {});
        });
        
        // Payment flow
        subscriptions.setOnPaymentResponse(paymentPromise => {
          paymentPromise.then(paymentResponse => {
            var idToken = paymentResponse.userData.idToken;
            if (!idToken) return;
            var purchaseData = JSON.parse(paymentResponse.purchaseData.raw),
              purchaseToken = purchaseData.purchaseToken;
            if (!purchaseToken) return;
            ensightenTrack({
              poid: purchaseData.orderId,
              pulse5: 'SwG purchase',
              pulse6: reg.user.isLoggedIn() ? 'signed-in' : 'signed-out',
              pulse39: productID,
              pulse82: 'SwG purchase',
              pulse93: '24',
              pulse1060: 'true'
            });
            gaTrack([
              () => ga('trb.ec:setAction', 'purchase', { id: purchaseData.orderId }),
              () => ga('trb.send', 'event', 'Subscribe with Google', 'Subscribe with Google purchase complete', {
                metric46: 1,
                dimension117: productID,
                dimension118: 'Subscribe with Google'
                })
            ]);

            $.post(
              `${loc.protocol}//${conf.get('ssorBaseUrl')}/swg/tokensignin`,
              { id_token: idToken, product_code: conf.get('productCode'), purchase_token: purchaseToken },
              ssorUserProfile => {
                if (!('masterId' in ssorUserProfile)) return;
                ensightenTrack({
                  pulse5: 'SwG registration',
                  pulse6: 'signed-in',
                  pulse39: productID,
                  pulse82: 'SwG registration',
                  pulse93: '24',
                  pulse41: 'true',
                  pulse1052: 'true',
                  pulse1067: 'true',
                  pulse1076: 'true'
                });
                gaTrack([() => ga('trb.send', 'event', 'Subscribe with Google', 'Subscribe with Google registration', {
                  metric47: 1,
                  dimension117: productID,
                  dimension118: 'Subscribe with Google'
                })]);
                if (conf.get('swgOfferId')) {
                  (function tryMg2Link(retries, delay) {
                    linkToMg2(ssorUserProfile, conf.get('swgOfferId'), paymentResponse.purchaseData.raw)
                    .done(() => {
                      paymentResponse.complete().then(
                        () => signInUser(ssorUserProfile),
                        () => { /* no-op */ }
                      );
                    })
                    .fail(() => {
                      //  TODO: Refactor retries into a while loop for better garbage collection
                      if(retries > 0) {
                        setTimeout(function() {
                          tryMg2Link(--retries, delay);
                        }, delay);
                      } else {
                        paymentResponse.complete().then(
                          () => signInUser(ssorUserProfile),
                          () => { /* no-op */ }
                        );
                      }
                    });
                  })(3, 1000);
                } else {
                  paymentResponse.complete().then(
                    () => signInUser(ssorUserProfile),
                    () => { /* no-op */ }
                  );
                }
              }
            );
          }, () => {});
        });
      });
    }
  })();

  util.poll('body', function start() {
    var back = /&?dssReturn(=true)?/g,
        verify = loc.href.match(back); //mutiple
    met.ajax.getFBPersistLogin(
      { 
        callback: res=> {
          if(true === res.bypass){ 
            reg.manager.user.login(res.master_id,()=>util.redirectUser(res.url), '_'); 
          }
        }
      });
    evnt.on('reg_handler_click', mngr.user.clearCache);
    evnt.on('reg_after_logout', mngr.user.clearCache);
    evnt.on('reg_after_logout', mngr.user.clearSubStatus);
    if(!user.isLoggedIn()) mngr.user.clearSubStatus();

    evnt.on('reg_after_login', function(update) {
      mngr.user.subscriptions(null, !update);
    });
    evnt.on('reg_before_comment', function comment(callback) {
      callback.intercept = true;

      util.specialMeter('comment', function(rule) {
        if (!rule || !rule.e.dialog) callback(); else {
          callback.wait();

          if (!rule.e.shown) { //intl
            reg.manager.showMessageDialog('We apologize but commenting is not permitted for your region.');
            callback.stop();
          } else evnt.next('met_close_dialog', function(auto) { //wall
            auto ? comment(callback) : callback.stop();
          });
        }
      });
    });
    evnt.next('met_after_meter', function() {
      trb.userTiming('met before push');
      met.push.apply(met, ready);
      trb.userTiming('met after main');
    });
    mngr.user.subscriptions(function(subs) {
      verify && util.url.del(back, true);

      if (!verify || !subs.length || !/=/.test(verify.pop())) met.meter(); else {
        evnt.next('reg_after_register', function() {
          var label = conf.get('labels').welcome;
          label.message = label.message.replace('registered', 'subscribed');
        });

        evnt.fire('met_after_meter');
        conf.set('successfulLoginRedirect', '${refresh}');
        reg.manager.showWelcomeDialog();
      }
    }, verify);
  });
}

  });
})({"product":"chckout002","market":"recurlycheckout","meterResetDays":-60,"internationalEnabled":null,"rules":[{"i":1187,"_":"Checkout Main Structure","a":",,showFlyout,showFlyout,","u":"+/override/checkout_page"},{"i":1197,"_":"Header","a":",,showFlyout,showFlyout,","u":"+/override/header"},{"i":1196,"_":"Full Digital Access","a":",,showFlyout,showFlyout,","u":"+/override/full_digital_access"},{"i":1186,"_":"Page Step","a":",,showFlyout,showFlyout,","u":"+/override/page_step"},{"i":1190,"_":"User Login","a":",,showFlyout,showFlyout,","u":"+/override/user_login"},{"i":1195,"_":"Register Providers","a":",,showFlyout,showFlyout,","u":"+/override/register_providers"},{"i":1242,"_":"Payment Information ","a":",,,showFlyout,","u":"+/override/payment_info","l":0},{"i":1243,"_":"Plan Custom Block One ","a":",,,showFlyout,","u":"+/override/plan_custom_block_one","l":0},{"i":1244,"_":"Plan TC","a":",,showFlyout,showFlyout,","u":"+/override/plan_tc","l":0},{"i":1198,"_":"Footer","a":",,showFlyout,showFlyout,","u":"+/override/footer"}]});
