
    class RecDssState {
        constructor() {
          this.activeStep = 1;
          this.marketCode = null,
          this.planId = null;
          this.login = {
            email = '',
            ssorid = 0
          }
          this.payment = {
            confirmid = null,
            rec_token = null
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
  
        nextStep () {
          this.notify(++this.activeStep);
        }
      }
  
  var state = new RecDssState();