let userTable= document.getElementById("userData")
if(userTable){
    userTable.addEventListener('click', (e)=>{
    console.log(e.target.classList.contains('block'))
    if(e.target.classList.contains('block')){
        blockUser(e)
    }
 })   
}


function blockUser(e){
    const userId = e.target.dataset.url
    console.log(userId)
    const url = 'http://localhost:4000/admin/users/block/'+userId
    console.log(url)
    const id=`${userId}`

    fetch(url,{
        method:'PUT',
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


