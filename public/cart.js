let cartCard = document.querySelector('.cart-items-container');
if(cartCard) {
    
    cartCard.addEventListener('click' , (e) => {
        console.log(e.target);
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
    const url = `http://localhost:4000/cart/${productId}` ;
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
    const url = `http://localhost:4000/cart/inc/${productId}` ;
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
    console.log(productId);
    const url = `http://localhost:4000/cart/dec/${productId}` ;
    console.log(url);
    const res = await fetch(url, {
                    method: 'put',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });
                
    // if(e.target.parentNode.querySelector('#form1').value == 1); {
    //    e.target.disabled = true;
    // }


    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
}


///error message timing
// document.addEventListener('DOMContentLoaded', function() {
//     const message = document.getElementById('errormessagecart');
//     message.style.display = 'block';
//     setTimeout(function() {
//       message.style.display = 'none';
//     }, 2000);
//   });