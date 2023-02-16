
const ctx = document.getElementById('myChart');
 fetch('/admin/order-details',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(response => {
    console.log(response)
    const label = response.productSale.map(item=>{
      const check = new Date(item.date)
      const now = new Date()
      if(check.getFullYear() == now.getFullYear() && check.getMonth() == now.getMonth()){
        return new Date(item.date).toLocaleDateString('en-GB')
      }
    })

    const datas = response.productSale.map( item => {
      const check = new Date(item.date)
      const now = new Date()
      if(check.getFullYear() == now.getFullYear() && check.getMonth() == now.getMonth()){
        return item.totalAmount
      }
    })
    const data = []
    label.forEach( (item, index) => {
      if(item!= undefined){
        data.push(datas[index]) 
      }
    })
    console.log(data)
    console.log(label)
    new Chart(ctx, {
        type: 'bar',
        data: {
          labels: label,
          datasets: [{
            barThickness: 40,
            minBarLength: 2,
            label: "Sales for the year per day",
            data: data,
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            x: {
              stacked: true
          },
            y: {
              beginAtZero: true
            },
            
          }
        }
      });
  })

//product wise sale

fetch('/admin/product-data',{
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(response =>{console.log(response)

let data = [];

for (let i = 0; i < response.length; i++) {
  data.push({
    label: response[i].product_name,
    value: response[i].total_orders
  });
}

let cty = document.getElementById("myPieChart").getContext("2d");

let myPieChart = new Chart(cty, {
  type: "pie",
  data: {
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => d.value),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(205, 192, 192, 0.2)",
          "rgba(350, 300, 192, 1)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(205, 192, 192, 0.2)",
          "rgba(350, 300, 192, 1)",
        ],
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});

} 
)


//date format

  // changing the date format
  const dateContainer = document.querySelectorAll('.reportDate');
  for (let index = 0; index < dateContainer.length; index++) {
      const element = dateContainer[index];
      let date = new Date(element.textContent.replace('IST', ''));
      let day = date.getDate();
      let month = date.getMonth()+1;
      let year = date.getFullYear();
      element.textContent =  day+"-"+month+"-"+ year ;
  }
