

  // changing the date format
const dateContainer = document.querySelectorAll('.date');
for (let index = 0; index < dateContainer.length; index++) {
    const element = dateContainer[index];
    let date = new Date(element.textContent.replace('IST', ''));
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    element.textContent =  day+"-"+month+"-"+ year ;
}


//validation
let Cform = document.getElementById('couponForm');
if(Cform){
    Cform.addEventListener('submit',(e)=>{
        e.preventDefault();
        if(document.getElementById('couponCode').value === ''){
            alert('Enter coupon name')
        }
        else if(document.getElementById('expiryDate').value===''){
            alert('Enter expiry Date')
        }
        else if(document.getElementById('discountAmount').value===''){
            alert('Enter discount amount')
        }
        else if(document.getElementById('minimum').value===''){
            alert('Enter minimum discount amount')
        }
        else{
            Cform.submit()
        }
    })
}



//delete coupon

let delcoupon =document.querySelectorAll('#delCoupon')
if(delcoupon){ 
    delcoupon.forEach((delbut)=>{
        delbut.addEventListener("click", (e) =>{
        deleteCoupon(e);
    })
    }) 
  }
  async function deleteCoupon(e){
    const cId = e.target.dataset.url 
    const url = `/admin/delCoupon/${cId}`
    let res =  await  fetch(url,{
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        cache: "no-cache", 
    })
    const response = await res.json();
    if(response.redirect){

        window.location.href = response.redirect;

    }
}

// coupon action
async function couponAction(e){
    try {
        const cId = e.target.dataset.url 
        const url = `/admin/couponAction/${cId}`
        let res =  await  fetch(url,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const response = await res.json();
        console.log(response)
        if(response.redirect){
    
            window.location.href = response.redirect;
    
        }
        
    } catch (error) {
        
    }
}
   
