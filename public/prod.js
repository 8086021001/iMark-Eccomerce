

//deleting product

let prodData = document.getElementById('ProdData');
if(prodData){
    prodData.addEventListener('click',(e)=>{
        // e.preventDefault();
        if(e.target.classList.contains('delproduct')) {
            console.log('deleting product')
            delProduct(e)
        }
        if(e.target.classList.contains('removeProduct')){
            console.log('in remove ')

            console.log('Removing product')
            removeProduct(e)
        }
    })
}



function delProduct(e){
    console.log(e.target.dataset.url)
    const proId = e.target.dataset.url
    const url = '/admin/product/delete/'+proId
    const id=`${proId}`
    fetch(url,{
        method: 'delete',
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

function removeProduct(e){
    console.log(e.target.dataset.url)
    const proId = e.target.dataset.url
    const url = '/admin/product/remove/'+proId
    const id=`${proId}`
    fetch(url,{
        method: 'PATCH',
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



//edit product

// function ediProduct(pid){
//     console.log(pid)
//     const url = '/admin/product/getEdit/'+pid
//     const id=`${pid}`
//     fetch(url,{
//         method: 'put',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({_id:id})
//     })
//     .then(response => response.json())
//     .then(response=>{
//         window.location.href=response.redirect
//     })
// }



   


const productUpdateForm = document.querySelector('#editProduct');
if(productUpdateForm) {
    console.log('Helloooo');
    productUpdateForm.addEventListener('click' , (e) => {
        if(e.target.classList.contains('Update-prod')){
            editProduct(e)
        }}
        )
    }


    function editProduct(e){
        // let count = document.querySelectorAll('#file').length;
        // let images = document.querySelectorAll('#file').files;
        // console.log(images)


        // console.log(count)
        // console.log(document.querySelectorAll('#file'));
        // for (let i = 0; i < document.querySelectorAll('#file').length ; i++) {
        //     let image = document.querySelectorAll('#file').files[i]
        //     let imag = images.getAttribute(image)

        //     console.log(imag)


        // }
       

        // let images = document.querySelector('#file').files
        // console.log(images)
        console.log(e.target.dataset)
        const uid = e.target.dataset.url;
        console.log(uid)
                const updateFormData = {
                name: document.getElementById("product_name").value,
                category:document.getElementById("category").value,
                highlights:document.getElementById("highlights").value,
                price:document.getElementById("price").value,
                size:document.getElementById("product_size").value,
                inventory:document.getElementById("inventory").value,
                description:document.getElementById("product_description").value,              
            }
            updateProduct(uid,updateFormData)


    }

//             function getImages() {
//                 const imageArray = [];
//                 for (let i = 0; i < images.length; i++) {
//                   imageArray.push(images[i].src);
//                 }
//                 return imageArray;
//               }
//               if(images.length!=0){
//             const image =  getImages();
//             const updateFormData = {
//                 name: document.getElementById("product_name").value,
//                 category:document.getElementById("category").value,
//                 highlights:document.getElementById("highlights").value,
//                 price:document.getElementById("price").value,
//                 size:document.getElementById("product_size").value,
//                 inventory:document.getElementById("inventory").value,
//                 description:document.getElementById("product_description").value,              
//             }
//             updateProduct(uid,updateFormData,image)

//               }else{
//                 const updateFormData = {
//                     name: document.getElementById("product_name").value,
//                     category:document.getElementById("category").value,
//                     highlights:document.getElementById("highlights").value,
//                     price:document.getElementById("price").value,
//                     size:document.getElementById("product_size").value,
//                     inventory:document.getElementById("inventory").value,
//                     description:document.getElementById("product_description").value,
        
//                 }
//                 updateProduct(uid,updateFormData)
//               }
//         }
//         }
//     })
// }

function updateProduct(uid,updateFormData){
    const url = '/admin/product/edit/'+uid
    console.log(updateFormData);
    fetch(url,{
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateFormData)
         
    })
    // .then(response => response.json())
    // .then(response=>{
    //     window.location.href=response.redirect
    // })
}


// add products validation
const addForm = document.querySelector('.form-addProducts')
if(addForm){
    addForm.addEventListener('submit',(event)=>{
        event.preventDefault()
        vatidated()
        if(vatidated){
            addForm.submit()
        }else{
            event.preventDefault()
        } 
    })
}


function vatidated(){

    if(document.getElementById("product_name").value ==''){
        alert('Name field required')
        return false
    }
    else if(document.getElementById("category").value ==''){
        alert('Category field required')
        return false
    }
    else if(document.getElementById("price").value==''){
        alert('Price field required')
        return false
    }
    else if(document.getElementById('inventory').value==''){
        alert('Inventory required')
        return false
    }
    else {
        return true
    }
}










document.addEventListener('DOMContentLoaded', function() {
    const message = document.getElementById('prodmessage');
    if(message){
        message.style.display = 'block';
        setTimeout(function() {
          message.style.display = 'none';
        }, 2000);
    }

  });







//image change in product view

function change_image(image){

    var container = document.getElementById("thumb-image");

   container.src = image.src;
}



