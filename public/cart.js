let cartCard = document.querySelector('.cart-items-container');
if(cartCard) {
    
    cartCard.addEventListener('click' , (e) => {

        if(e.target.classList.contains('delete-btn')) {
            console.log('Hi')
            removeFromCart(e);
        }
        else if(e.target.classList.contains('quantity-up')) {
            incQuantity(e);
        } 
        else if(e.target.classList.contains('quantity-down')) {
                decQuantity(e);   
        }    
    })
}


 async function removeFromCart(e) {
    const productId = e.target.dataset.url;
    const url = `/cart/${productId}` ;
    console.log(url);
    const res = await fetch(url, {
                    method: 'delete',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;




}





async function incQuantity(e) {
    const productId = e.target.dataset.url;
    console.log(productId);
    const url = `/cart/inc/${productId}` ;
    console.log(url);
    const res = await fetch(url, {
                    method: 'put',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });

    
                
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
}



async function decQuantity(e) {
    const productId = e.target.dataset.url;
    const url = `/cart/dec/${productId}` ;
    
    let quantityValue  =  e.target.parentNode.querySelector('#form1').value

    const res = await fetch(url, {
                    method: 'put',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    },
                    body:JSON.stringify({quantValue:quantityValue})
                });            
    const redirectPath = await res.json();
    console.log(redirectPath);
    if(redirectPath.redirect){
        window.location.href=redirectPath.redirect
    }else{
        document.querySelector('.total_amount').textContent = redirectPath.totalAmount;
        e.target.parentNode.querySelector('#form1').value = redirectPath.quantity;
}
}

let dateFormater = document.querySelectorAll("#deliveredDate")
if(dateFormater){
    for (let index = 0; index < dateFormater.length; index++) {
        const element = dateFormater[index];
        let date = new Date(element.textContent.replace('IST', ''));
        let day = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear();
        element.textContent =  day+"-"+month+"-"+ year ;
    }
}
