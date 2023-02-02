

let codBtn = document.querySelector('.cod-button');

if (codBtn) {
    codBtn.addEventListener('click', (e) => {
        console.log('Hi')
        createOrder(e);
    })
}

let razorbtn = document.querySelector('.razorpay-button')
if (razorbtn) {
    razorbtn.addEventListener('click', (e) => {
        createOrder(e);
    })
}


//for creating order

async function createOrder(e) {
    console.log(document.querySelector('input[name="address"]:checked').value)
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