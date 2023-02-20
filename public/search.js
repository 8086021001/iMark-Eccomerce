const searchForm = document.querySelector('.searchForm');
// const results = document.querySelector('#search-results');

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const query = searchForm.elements.search.value;
  const response = await fetch(`/search?search=${query}`);
  const Products = await response.json();

  console.log(Products)
    const productListContainer = document.querySelector('.productList');

  productListContainer.innerHTML = '';

  if(Products.products==0){
    productListContainer.innerHTML = `<div class='empty-product'>
    <h1>Can't find any product with this name</h1>
    <lottie-player src="https://assets4.lottiefiles.com/packages/lf20_rc6CDU.json"  background="transparent"  speed="1"  style="width: 300px; height: 300px;"  loop  autoplay></lottie-player>    
</div>`

  }else{
    Products.products.forEach( (product) => {
      let productContent =   `  <div class="col-sm-6 col-md-4 col-lg-3 d-flex align-items-center m-5">
                              
      <div class="box h-100">  
         <div class="option_container">
            <div class="options">
               <a href="/product/view/${product._id}" class="option2">
               Buy Now
               </a>
            </div>
         </div>
         <div class="img-box">
            <img style="width:25vh;height:40vh" src="/${product.images[0]}" alt="my image">
         </div>
         <div class="col detail-box">
            <h5>
               ${product.name}
            </h5>
            <h6 style="font-size: x-large;">
                ₹${product.price}
            </h6>
         </div>
         
      </div>
      
   </div>`

      productListContainer.innerHTML = productListContainer.innerHTML + productContent;  
 });
  }

});

