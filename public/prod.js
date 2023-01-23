

//Delete category
let catTable= document.getElementById("catTable")
if(catTable){
 catTable.addEventListener('click', (e)=>{
    if(e.target.classList.contains('delete-cat')){
        console.log("in del")
        deleteCat(e)
        console.log("working3")
    }
 })   
}


function deleteCat(e){
    console.log(e.target.dataset.url) ;
    const catId = e.target.dataset.url
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


//deleting product
let ProdData = document.getElementById('ProdData');
console.log(ProdData);
if(ProdData){
    ProdData.addEventListener('click',(e)=>{
        if(e.target.classList.contains('delproduct')) {
            console.log('deleting product')
            delProduct(e)
        }
    })
}



function delProduct(e){
    console.log(e.target.dataset.url)
    const proId = e.target.dataset.url
    const url = 'http://localhost:4000/admin/product/delete/'+proId
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



//edit product

function ediProduct(pid){
    console.log(pid)
    const url = 'http://localhost:4000/admin/product/edit/'+pid
    const id=`${pid}`
    fetch(url,{
        method: 'put',
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

