//Coupon validation




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
