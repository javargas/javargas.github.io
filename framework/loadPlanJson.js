function loadplanJson(planData) {
    
    // This variables come from url params (DSS-15805)
    var market = recDssState.getData("params").market;
  	 

               console.log("planData 2: ", planData);      
                     
                // Identify the rules (default and market)
                let defaultRule;
                let marketRule;

                let re = new RegExp(market);
                for(let rule of planData.rules) {
                    if(defaultRule !== undefined && marketRule !== undefined){
                        break;
                    }
                    if(/defaultconfig/.test(rule.urlPattern)){
                      defaultRule = rule;
                      continue;
                    }
                    if(re.test(rule.urlPattern)){
                      marketRule = rule;
                    }
                };
                     
                     console.log("Default Rule: ", defaultRule);
                     console.log("Market Rule: ", marketRule);

                let layoutConfig = [];
                if (typeof marketRule != "undefined") {
                    layoutConfig = planData.reactions.within[marketRule.id];
                  
                  	if (typeof layoutConfig == "undefined") {
                    	layoutConfig = planData.reactions.exceed[marketRule.id];
                    }
                  
                  	if (typeof layoutConfig == "undefined") {
                    	layoutConfig = planData.reactions.abandon[marketRule.id];
                    }

                    // First we need to merge values from default config with 
                    // values from specific market config (If there exists)
                    if (typeof defaultRule !== "undefined") {
                        let layoutDefault = planData.reactions.within[defaultRule.id];
						console.log("LayoutDefault: ", layoutConfig);
                        // merging default values in market
                        Object.entries(layoutConfig).forEach(entry => {
                            const [key, value] = entry;

                            if (typeof value == 'undefined' || value === null){
                                if (typeof layoutDefault[key] != "undefined") {
                                    layoutConfig[key] = layoutDefault[key];
                                } 
                            }
                        });
                    }
                } else { 
                    if (typeof defaultRule != "undefined") {
                        layoutConfig = planData.reactions.within[defaultRule.id];
                    }
                }
                     
                     console.log("Layout config: ", layoutConfig);

                /* Doing the replace with template.parse */                
                console.log("Doing the replace with template.parse");
	            let codeLayout = planData.layouts[layoutConfig.layoutID].value;
                trb.registration.template.templates.dss['plan'] = codeLayout;
                let layoutParsed = trb.registration.template.parse('dss.plan', layoutConfig);     
                
                let block = $('#${planBlockId}');
                $(layoutParsed).appendTo(block);
            
}

  if (typeof planData != "undefined") {
    loadplanJson(planData)
  }
  