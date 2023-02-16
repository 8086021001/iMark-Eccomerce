
console.log('Hii');

//category validation
const catform = document.querySelector('.catform')
const catName = document.getElementById('Catname')

if(catform){
  catform.addEventListener("submit", function(event) {
    let file = document.querySelector(".input-file").files[0];
    if(document.getElementById('Catname').value==""){
        alert("Field cannot be empty.");
        event.preventDefault();
        return;
    }else{
        catform.submit()
    }
  });
}




  

//category validation
document.addEventListener('DOMContentLoaded', function() {
    const message = document.getElementById('errormessage');
    message.style.display = 'block';

    setTimeout(function() {
      message.style.display = 'none';
    }, 2000);
  });

//image validation

// const input = document.querySelector('input[type="file"]');
// const errorMessage = document.querySelector('#errormessage');

// if(input){
//   input.addEventListener('submit', function (event) {
//     event.preventDefault();
  
//     // Check if a file was selected
//     if (!input.files[0]) {
//       errorMessage.innerHTML = 'Please select a file';
//       errorMessage.style.display = 'block';
//       return;
//     }
  
//     // Check if the file is an image file
//     const file = input.files[0];
//     const fileName = file.name;
//     const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
//     if (!allowedExtensions.exec(fileName)) {
//       errorMessage.innerHTML = 'Only image files are allowed';
//       errorMessage.style.display = 'block';
//       return;
//     }
  
//     // If the file is valid, submit the form
//     errorMessage.style.display = 'none';
//     form.submit();
//   });
// }






//Delete category




function deleteCat(event){
    console.log(event.target.dataset.url) ;
    const catId = event.target.dataset.url
    const url = 'http://localhost:4000/admin/category/delete/'+catId
    const id=`${catId}`

    fetch(url,{
        method:'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({_id:id})
    })
    .then(response => response.json())
    .then(response=>{
        window.location.href=response.redirect
    })
    
}
