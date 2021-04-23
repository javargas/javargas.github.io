   
        class RecDssState {
            constructor(marketCode, planId) {
              this.activeStep = 1;
              this.productCode = null,
              this.marketCode = marketCode,
              this.planId = planId;
              this.login = {
                "email" : '',
                "password" : '',
                "ssorid" : 0,
                "isNew" : false,
                "authenticated" : false,
                "validEmail" : false
              }
              this.payment = {
                "confirmid" : null,
                "rec_token" : null,
                "method" : null
              },
              this.observers = [];
    
    
            }
      
            subscribe(f) {
              this.observers.push(f);
            }
      
            unsubscribe(f) {
              this.observers = this.observers.filter(subscriber => subscriber !== f);
            }
      
            notify(data) {
              this.observers.forEach(observer => observer(data));
            }
      
            /**
             * callback: function to use depending of the state
             *			step1: validation for email
             *			step2: register or authentication
             *			step3: payment method
             */
            nextStep (callback) {

              /* General validations*/
              if (typeof callback == 'function') {

                  let canContinue = false;
                  
                  // Email validation
                  if (this.activeStep == 1) {
                    if (callback(this.login.email)) {
                      canContinue = true;
                    }
                  }
        
                  // Register or password validation	
                  if (this.activeStep == 2) {
                    if (callback(this.login)) {
                      canContinue = true;
                    }
                  }
        
                  // Payment method	
                  if (this.activeStep == 3) {
                    if (callback(this.payment)) {
                      canContinue = true;
                    }
                  }
        
                  if (canContinue) {
                      this.notify(++this.activeStep);
                  }
              }
            }
            
            loadPlan(planBlockId, marketOverride){
    
              var mkt = marketOverride;
              if (!mkt || 0 === mkt.length || mkt.includes(marketOverride)) {
                console.log('Display Plan Block: ' + planBlockId);
                document.getElementById(planBlockId).innerHTML='Using Ajax to load <b>'+planBlockId+'</b> block from the input Plan <b>'+this.planId+'</b> for the market <b>'+this.marketCode +'</b>...';
              } else {
                console.log('Market mismatch. vaild market:' +marketOverride +' does not contain '+ this.marketCode);
              }
            }
          }
      
      if (typeof marketCode == "undefined") {
        marketCode = null;
      }
      
      if (typeof mtrParam == "undefined") {
        mtrParam = null;
      }
      
      var recDssState = new RecDssState(marketCode, mtrParam);