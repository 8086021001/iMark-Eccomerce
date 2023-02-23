




//admin orderstatus setting

const statusForm = document.querySelectorAll('#order-form');
if(statusForm){
  statusForm.forEach(statform => {

    statform.addEventListener('submit', async (event) => {
      event.preventDefault(); 
      const Sid = statform.querySelector('input[name="Sid"]').value;
      const status = statform.querySelector('input[name="status"]').value;
      console.log(Sid)
      console.log(status)
      const res = await fetch(statform.action, {

        method: statform.method,
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id:Sid,
          stat:status
        })
      })
      const response = await res.json();
      if(response.message){
        let messag = document.querySelector('#messages')
        messag.innerHTML = response.message
      }else{
        window.location.href = response.redirect;
      }

    });
  });


}

//Biiling toggler
let collapseAddres = document.querySelector(".collapsible");

let addressForm = document.querySelector('.address-form-body');
if(addressForm) {
    addressForm.style.display = 'none'
}

if(collapseAddres) {
    collapseAddres.addEventListener('click' , (e) => {
        if (addressForm.style.display === "block") {
            addressForm.style.display = "none";
          } else {
            addressForm.style.display = "block";
          }
    })
}


///address check validation



const radioBtn =  document.querySelector('input[type="radio"]');
if(radioBtn){
  radioBtn.checked = true;
}


let razorbtn = document.querySelector('.razorpay-button')
let codBtn = document.querySelector('.cod-button');

if (codBtn) {
  codBtn.addEventListener('click', (e) => {

    createOrder(e);
      
  })
}
if (razorbtn) {
  
    razorbtn.addEventListener('click', (e) => {
      createOrder(e);
    })
  }





//for creating order

async function createOrder(e) {

    const url = `/order/create`;
    let methodofPayment;
    if (e.target.classList.contains('cod-button')) {
        methodofPayment = 'cash on delivery'
    } else if (e.target.classList.contains('razorpay-button')) {
        methodofPayment = 'Razor pay'
    }

    const res = await fetch(url, {
        method: 'post',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            totalAmount: document.querySelector('.order-price').textContent,
            paymentMethod: methodofPayment,
            orderStatus: 'placed',
            shippingInfo: document.querySelector('input[name="address"]:checked').value
        })
    })
    const redirectPath = await res.json()
    console.log(redirectPath);
    if (redirectPath.myOrder) {
        console.log(' response redirecting works!!');
        let options = {
            key: "rzp_test_InnUXzxUSMYiRr", // Key ID
            amount: redirectPath.myOrder.amount * 100, // Amount is in paise
            currency: "INR",
            order_id: redirectPath.myOrder.id, //This is a sample Order ID
            handler: function() {
                window.location.href = redirectPath.redirect;
            }
        };
        console.log(options);
        var rzp1 = new Razorpay (options);
        rzp1.open();
        e.preventDefault();

    } else {
        window.location.href = redirectPath.redirect;   

    }

}


//user cancel order
let cancelOrder = document.querySelectorAll('#deleteOrder')
if(cancelOrder){ 
  cancelOrder.forEach((cancelBut)=>{
    cancelBut.addEventListener("click", (e) =>{
      delOrder(e);
  })
  }) 
}

async function delOrder(e){
    const orderId = e.target.dataset.url 
    const url = `/order/cancel/${orderId}`
    let res =  await  fetch(url,{
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const response = await res.json();
    if(response.messag){
      let message = document.getElementById('message')
      message.innerHTML = response.messag;
    }else{
      window.location.href = response.redirect;

    }
}




  //Applying coupon

  let Cbutton = document.querySelector('#couponButton')
  if(Cbutton){
    Cbutton.addEventListener('click',async ()=>{
      let couponApplied = document.querySelector('#couponcode').value
      const url = '/order/applycoupon';
      console.log(url);
      const res = await fetch(url, {
                      method: 'post',
                      credentials: "same-origin",
                      headers: {
                      'Content-Type' : 'application/json'
                      },
                      body: JSON.stringify({couponcode:couponApplied,
                        totalAmount: document.querySelector('.order-price').textContent})
                  }
                  );
                  
      const response = await res.json();
      let amount = document.getElementById('order-price');
      let meassage = document.getElementById('couponMessage')
      if(response.totalAmount){
        amount.innerHTML = response.totalAmount;
      }
      meassage.innerHTML = response.msg;
      

    })
  }


  //date format

  // changing the date format
  const dateContainer = document.querySelectorAll('.Orderdate');
  for (let index = 0; index < dateContainer.length; index++) {
      const element = dateContainer[index];
      let date = new Date(element.textContent.replace('IST', ''));
      let day = date.getDate();
      let month = date.getMonth()+1;
      let year = date.getFullYear();
      element.textContent =  day+"-"+month+"-"+ year ;
  }

//admin deliver order

let delivOrder = document.querySelectorAll("#deliver") 
if(delivOrder){
  delivOrder.forEach((delbutton)=>{
    delbutton.addEventListener('click',(e)=>{
      deliverOrder(e)
})

  })

}

async function deliverOrder(e){
  let orderId = e.target.dataset.url ;
  const url = '/admin/order/deliver/'+orderId
  let res =  await  fetch(url,{
          method: 'put',
          credentials: "same-origin",
          headers: {
          'Content-Type' : 'application/json'
          },
      })
      const respo = await res.json();
      console.log(respo)
      if(respo.messag){
        let message = document.getElementById("message")
        message.innerHTML = respo.messag
      }else{
        window.location.href = respo.redirect;

      }

}

//user returning order
let retOrder = document.querySelectorAll("#returnOrder")
if(retOrder){
  retOrder.forEach((retBut)=>{
    retBut.addEventListener('click',(e)=>{
      returnOrder(e)
    })
  })
}

async function returnOrder(e){
  try {
    let orderId = e.target.dataset.url ;
    const url = '/order/returnOrder/'+orderId
    let res =  await  fetch(url,{
            method: 'put',
            credentials: "same-origin",
            headers: {
            'Content-Type' : 'application/json'
            },
        })
        const respo = await res.json();
        console.log(respo)
        if(respo.messag){
          let meassage = document.querySelector('#message')
          meassage.innerHTML = respo.meassag
        }else{
          window.location.href = respo.redirect;
        }
  } catch (error) {
    console.log(error)
    
  }
}

//admin approving return
let approvReturn = document.querySelector('#ApproveReturn')
if(approvReturn){
  approvReturn.addEventListener('click',(e)=>{
    approveReturn(e)
  })
}

async function approveReturn(e){
  try {
    let orderId = e.target.dataset.url ;
    console.log(orderId)
    const url = '/admin/approveReturn/'+orderId
    let res =  await  fetch(url,{
            method: 'put',
            credentials: "same-origin",
            headers: {
            'Content-Type' : 'application/json'
            },
        })
        const response = await res.json(); 
        if(response.meassag){
          let meassage = document.querySelector('#message')
          meassage.innerHTML = response.meassag

        }else{
          window.location.href = response.redirect;
        }
  } catch (error) {
    console.log(error)
  }
}


//create order using wallet 

let walBut = document.querySelector("#walletButton")

if(walBut){
  walBut.addEventListener('click', (e)=>{
    console.log('In wallet')
    createWalletOrder(e)

  })
}

async function createWalletOrder(e){
  if(e.target.classList.contains('walletButton')){
    let methodofPayment = 'Wallet'
    console.log(document.querySelector('.order-price').textContent)

    const url = `/order/create`;
    const res = await fetch(url, {
      method: 'post',
      credentials: "same-origin",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          totalAmount: document.querySelector('.order-price').textContent,
          paymentMethod: methodofPayment,
          orderStatus: 'placed',
          shippingInfo: document.querySelector('input[name="address"]:checked').value
      })
    })
    const redirectPath = await res.json()
    window.location.href = redirectPath.redirect;
  }


}
