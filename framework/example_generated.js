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
      reactionJS: 'chckout002-reaction-1q2w3-9292807592178749622.js',
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

    /** js code  for metering */
  });
})({"product":"chckout002","market":"recurlycheckout","meterResetDays":-60,"internationalEnabled":null,"rules":[{"i":1187,"_":"Checkout Main Structure","a":",,showFlyout,showFlyout,","u":"+/override/checkout_page"},{"i":1197,"_":"Header","a":",,showFlyout,showFlyout,","u":"+/override/header"},{"i":1196,"_":"Full Digital Access","a":",,showFlyout,showFlyout,","u":"+/override/full_digital_access"},{"i":1186,"_":"Page Step","a":",,showFlyout,showFlyout,","u":"+/override/page_step"},{"i":1190,"_":"User Login","a":",,showFlyout,showFlyout,","u":"+/override/user_login"},{"i":1195,"_":"Register Providers","a":",,showFlyout,showFlyout,","u":"+/override/register_providers"},{"i":1242,"_":"Payment Information ","a":",,,showFlyout,","u":"+/override/payment_info","l":0},{"i":1243,"_":"Plan Custom Block One ","a":",,,showFlyout,","u":"+/override/plan_custom_block_one","l":0},{"i":1244,"_":"Plan TC","a":",,showFlyout,showFlyout,","u":"+/override/plan_tc","l":0},{"i":1198,"_":"Footer","a":",,showFlyout,showFlyout,","u":"+/override/footer"}]});