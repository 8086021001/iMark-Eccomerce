
console.log('In order')

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

// const radioButtons = document.querySelectorAll('input[type="radio"]');

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

    const url = `http://localhost:4000/order/create`;
    let methodofPayment;
    if (e.target.classList.contains('cod-button')) {
        console.log('COD!!');
        methodofPayment = 'cash on delivery'
    } else if (e.target.classList.contains('razorpay-button')) {
        console.log('razor');
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
            orderStatus: 'placed order',
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


//delete order
let cancelOrder = document.getElementById('deleteOrder')
if(cancelOrder){  
    cancelOrder.addEventListener("click", (e) =>{
        console.log('Hi')
        delOrder(e);
    })
}

async function delOrder(e){
    const orderId = e.target.dataset.url 
    console.log(orderId)
    const url = `http://localhost:4000/order/cancel/${orderId}`
let res =  await  fetch(url,{
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
}



//////paypal
const orderPriceElement = document.getElementById("order-price");
if(orderPriceElement){
  const totprice = orderPriceElement.innerHTML;
}

if(paypal){
  paypal
  .Buttons({
    
    createOrder: async function () {
      return await fetch("http://localhost:4000/order/create", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items:[
            {totalAmount:totprice },
            {paymentMethod: "paypal"},
            {orderStatus: 'placed order'},
            {shippingInfo: document.querySelector('input[name="address"]:checked').value}
          ]
        })

      })
        .then (async res => {
          if (res.ok) return res.json()
          else if(res.redirect ) window.location=res.redirect
          return res.json().then(json => Promise.reject(json))
        })
        .then(({ id }) => {
          return id
        })
        .catch(e => {
          console.error(e.error)
        })
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (orderData) {
        console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
        window.location = ("/order/success")
    });
    },
  })
  .render("#paypal")

}



  //Applying coupon

  let Cbutton = document.querySelector('#couponButton')
  console.log(Cbutton)
  if(Cbutton){
    Cbutton.addEventListener('click',async ()=>{
      let couponApplied = document.querySelector('#couponcode').value
      const url = 'http://localhost:4000/order/applycoupon';
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

//deliver order

let delivOrder = document.querySelector("#deliver") 
if(delivOrder){
  delivOrder.addEventListener('click',(e)=>{
          deliverOrder(e)
  })
}

async function deliverOrder(e){
  let orderId = e.target.dataset.url ;
  const url = 'http://localhost:4000/admin/order/deliver/'+orderId
  let res =  await  fetch(url,{
          method: 'put',
          credentials: "same-origin",
          headers: {
          'Content-Type' : 'application/json'
          },
      })
      const respo = await res.json();
      console.log(respo)
      window.location.href = respo.redirect;

}


let retOrder = document.querySelector("#returnOrder")
if(retOrder){
  retOrder.addEventListener('click',(e)=>{
    returnOrder(e)
  })

}

async function returnOrder(e){
  try {
    let orderId = e.target.dataset.url ;
    const url = 'http://localhost:4000/order/returnOrder/'+orderId
    let res =  await  fetch(url,{
            method: 'put',
            credentials: "same-origin",
            headers: {
            'Content-Type' : 'application/json'
            },
        })
        const respo = await res.json();
        console.log(respo)
        if(respo.redirect){
          window.location.href = respo.redirect;
        }else{
          let meassage = document.querySelector('#message')
          meassage.innerHTML = respo.meassage
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
    const url = 'http://localhost:4000/admin/approveReturn/'+orderId
    let res =  await  fetch(url,{
            method: 'put',
            credentials: "same-origin",
            headers: {
            'Content-Type' : 'application/json'
            },
        })
        const resp = await res.json(); 
  } catch (error) {
    console.log(error)
  }
}