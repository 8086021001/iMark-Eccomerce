//carousel
$('.carousel').carousel({
    interval: 2000
  })

//signUp
const form = document.getElementById("form")
const email = document.getElementById('Email')
const password = document.getElementById('Password')
const phone = document.getElementById('phone')
const firstName = document.getElementById('FirstName')
const lastName = document.getElementById('LastName')
const otp = document.getElementById('otp')
const otpForm = document.getElementById
console.log(form);

if(form){
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    console.log('Hello');
    if(validate()){
        form.submit()
    }else{
        e.preventDefault();
    }
})

function validate(){
    var emailValue = email.value.trim();
    var passwordValue = password.value.trim();
    var userName = firstName.value.trim();
    var phoneValue = phone.value.trim()
    var err = document.querySelector('.error');

    console.log(phoneValue)
 
    const emailPattern =/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    const phoneno = /^\d{10}$/;

    if(!emailValue.match(emailPattern)){
        text = "Please enter a valid email"
        err.textContent = text;
        err.style.height = '4rem';
        return false;
    }
    if(!passwordValue.match(passwordPattern)){
        text = "Please enter a valid password"
        err.textContent = text;
        err.style.height = '4rem';
        return false;
    }
    if(!phoneValue.match(phoneno)){
        text = "Enter a Valid Phone number !"
        err.textContent = text;
        err.style.height = '4rem';
        return false;
    }
    if(userName.length == " "){
        text = "Please enter your Name!"
        err.textContent = text;
        err.style.height = '4rem';
        return false;
    }
    if(userName.length<3){
        text = "Please enter a valid name"
        err.textContent = text;
        err.style.height = '4rem';
        return false;
    }

    return true;
}
}


//LOGIN
const forml = document.getElementById("forml")
const emaill = document.getElementById('Emaill')
const passwordl = document.getElementById('Passwordl')
var err = document.querySelector('.error');

if( forml){
forml.addEventListener('submit',(e)=>{
    e.preventDefault();
    console.log("signIn")

    if(validatelogin()){
        forml.submit()
    }else{
        e.preventDefault();
    }
})


function validatelogin(){
    var emailValue = emaill.value.trim();
    var passwordValue = passwordl.value.trim();

    const emailPattern =/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if(!emailValue.match(emailPattern)){
        text = "Please enter a valid email"
        err.textContent = text;
        err.style.height = '4rem';
        return false;
    }
    if(!passwordValue.match(passwordPattern)){
        text = "Please enter a valid password"
        err.textContent = text;
        err.style.height = '4rem';
        return false;
    }
    return true;
}
}

///resend OTP
function resendOtp(){
    const otp = document.querySelector('#otp').value
    var phone = phone.value
    const url = '/otp/resend'
    fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        otp,
        phone,
        resend:'true'
      })
    }).then((response) => response.json())
    .then((response) => {
      document.querySelector('.error').innerHTML = response.message
    })
  }



  