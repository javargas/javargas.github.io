
      
      if (typeof marketCode == "undefined") {
        marketCode = null;
      }
      
      if (typeof mtrParam == "undefined") {
        mtrParam = null;
      }
        
        var recDssState = ((m, p) =>{
              var activeStep = 1;
              var productCode = null;
              var marketCode = m;
              var planId = p;
              var login = {
                "email" : '',
                "password" : '',
                "ssorid" : 0,
                "isNew" : false,
                "authenticated" : false,
                "validEmail" : false,
                "blockId" : 'userLoginId'  // Div Id 
              }
              var payment = {
                "confirmid" : null,
                "rec_token" : null,
                "method" : null
              },

              var observers = []; 

            var notify = (data) => {
              this.observers.forEach(observer => observer(data));
            }

            return {          
      
              subscribe : (f) => {
                this.observers.push(f);
              },
        
              unsubscribe : (f) => {
                this.observers = this.observers.filter(subscriber => subscriber !== f);
              },                  
      
            nextStep : (validate) => {

              /* General validations*/
              if (typeof validate == 'function') {

                  let canContinue = false;
                  
                  if (this.activeStep == 1) {
                    if (validate(this.login.email)) {
                      canContinue = true;
                    }
                  }
        
                  if (this.activeStep == 2) {
                    if (validate(this.login.password)) {
                      canContinue = true;
                    }
                  }
        
                  if (canContinue) {
                      this.notify(++this.activeStep);
                  }
              }
            },
            
            loadPlan : (planBlockId, marketOverride) => {
    
              var mkt = marketOverride;
              if (!mkt || 0 === mkt.length || mkt.includes(marketOverride)) {
                console.log('Display Plan Block: ' + planBlockId);
                document.getElementById(planBlockId).innerHTML='Using Ajax to load <b>'+planBlockId+'</b> block from the input Plan <b>'+this.planId+'</b> for the market <b>'+this.marketCode +'</b>...';
              } else {
                console.log('Market mismatch. vaild market:' +marketOverride +' does not contain '+ this.marketCode);
              }
            }
          }
        })(marketCode, mtrParam);