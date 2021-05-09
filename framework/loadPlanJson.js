function loadPlanJson()
{
    // 1. Test fetch data json (Ricardo)

    // 2. Test sending param from plan and market (Arpit)

    // 3. Load de json data in a 
}

    
    let productData;
	fetch("http://127.0.0.1:8081/js/ww21.json")
      .then(response => response.json())
      .then(data => { productData = data;
                     console.log("productData", productData);
                     let codeLayout = productData.layouts[164].value;
    				console.log("layout 164: ", codeLayout);
                     
                     let block = $('#${planBlockId}');
                     $(codeLayout).appendTo(block);
            });
    
    
  }