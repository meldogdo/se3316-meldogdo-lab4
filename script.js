document.getElementById('powerSearchId').addEventListener('input', function () {
    const error = document.getElementById("inputError");
    if (!/^\d*$/.test(this.value)) {
        error.innerText = "Error: Only numbers are allowed in the ID field.";
    } else {
        error.innerText = "";
    }
});

document.getElementById('searchTerm').addEventListener('input', function () {
    const inputError = document.getElementById("inputError");
    if (!/^[A-Za-z-]*$/.test(this.value)) {
        inputError.innerText = "Error: Only English letters and hyphens are allowed in the search term field.";
    } else {
        inputError.innerText = "";
    }
});

function getHeroes(){
    let slection=document.getElementById("searchCriteria").value;
    if(slection=="publisher"){

    }
    if(slection=="nameOrId"){
        const id=document.getElementById("searchTerm").value;
         fetch(`/api/heros/${id}`)
         .then(res=>{
            if(res.ok){
            document.getElementById("status").innerText=""
            res.json()
         .then(data=>{ const l=document.getElementById('displayList');
         l.innerHTML=""
         data.forEach(e=>{ const item=document.createElement('li');
         console.log(item);
         const hero=`{"id": ${e.id}, "name": ${e.name}
         "Gender": ${e.Gender},
         "Eye color": ${e["Eye color"]},
         "Race": ${e.Race},
         "Hair color": ${e["Hair color"]},
         "Height": ${e.Height},
         "Publisher": ${e.Publisher},
         "Skin color": ${e["Skin color"]},
         "Alignment": ${e.Alignment},
         "Weight": ${e.Weight}}`
         item.appendChild(document.createTextNode(hero));
         l.appendChild(item);
        
         
         })
        
        })
        .catch(err=>{console.log(err)});
    }
    else{

        l=document.getElementById('displayList');
        l.innerHTML=""
        document.getElementById("status").innerText="Cannot find Hero"
    }
         
        })
 }
if(slection=="race"){
    const field=document.getElementById("searchTerm").value;
    let n=document.getElementById("numSuperheroes").value;
    const pattern="Race"
    if(n==''){
        n=0
    }
    fetch(`/api/heros/${n}/${pattern}/${field}`)
    .then(res=>{
        if(res.ok){
        document.getElementById("status").innerText=""
        res.json()
     .then(data=>{ const l=document.getElementById('displayList');
     l.innerHTML=""
     data.forEach(e=>{ const item=document.createElement('li');
     console.log(item);
     const hero=`{"id": ${e.id}, "name": ${e.name}
     "Gender": ${e.Gender},
     "Eye color": ${e["Eye color"]},
     "Race": ${e.Race},
     "Hair color": ${e["Hair color"]},
     "Height": ${e.Height},
     "Publisher": ${e.Publisher},
     "Skin color": ${e["Skin color"]},
     "Alignment": ${e.Alignment},
     "Weight": ${e.Weight}}`
     item.appendChild(document.createTextNode(hero));
     l.appendChild(item);
    
     
     })
    
    })
    .catch(err=>{console.log(err)});
}
else{

    l=document.getElementById('displayList');
    l.innerHTML=""
    document.getElementById("status").innerText="Cannot find Hero"
}
     
    })

}
if(slection=="publisher"){
    const field=document.getElementById("searchTerm").value;
    let n=document.getElementById("numSuperheroes").value;
    const pattern="Publisher"
    if(n==''){
        n=0
    }
    fetch(`/api/heros/${n}/${pattern}/${field}`)
    .then(res=>{
        if(res.ok){
        document.getElementById("status").innerText=""
        res.json()
     .then(data=>{ const l=document.getElementById('displayList');
     l.innerHTML=""
     data.forEach(e=>{ const item=document.createElement('li');
     console.log(item);
     const hero=`{"id": ${e.id}, "name": ${e.name}
     "Gender": ${e.Gender},
     "Eye color": ${e["Eye color"]},
     "Race": ${e.Race},
     "Hair color": ${e["Hair color"]},
     "Height": ${e.Height},
     "Publisher": ${e.Publisher},
     "Skin color": ${e["Skin color"]},
     "Alignment": ${e.Alignment},
     "Weight": ${e.Weight}}`
     item.appendChild(document.createTextNode(hero));
     l.appendChild(item);
    
     
     })
    
    })
    .catch(err=>{console.log(err)});
}
else{

    l=document.getElementById('displayList');
    l.innerHTML=""
    document.getElementById("status").innerText="Cannot find Hero"
}
     
    })
}
if(slection=="power"){
    const power=document.getElementById("searchTerm").value;
    let n=document.getElementById("numSuperheroes").value;
    if(n==''){
        n=0
    }
    fetch(`/api/heros/powers/${n}/${power}`)
    .then(res=>{
        if(res.ok){
        document.getElementById("status").innerText=""
        res.json()
     .then(data=>{ const l=document.getElementById('displayList');
     l.innerHTML=""
     data.forEach(e=>{ const item=document.createElement('li');
     console.log(item);
     const hero=`{"id": ${e.id}, "name": ${e.name}
     "Gender": ${e.Gender},
     "Eye color": ${e["Eye color"]},
     "Race": ${e.Race},
     "Hair color": ${e["Hair color"]},
     "Height": ${e.Height},
     "Publisher": ${e.Publisher},
     "Skin color": ${e["Skin color"]},
     "Alignment": ${e.Alignment},
     "Weight": ${e.Weight}}`
     item.appendChild(document.createTextNode(hero));
     l.appendChild(item);
    
     
     })
    
    })
    .catch(err=>{console.log(err)});
}
else{

    l=document.getElementById('displayList');
    l.innerHTML=""
    document.getElementById("status").innerText="Cannot find Hero"
}
     
    })
}
}
function getPublishers(){
    
    fetch("/api/heros/publisher/all")
        .then(res=>res.json()
        .then(data=>{ const l=document.getElementById('displayList');
        l.innerHTML=""
       data.forEach(e=>{ const item=document.createElement('li');
     console.log(item);
     const hero=`{"id": ${e.id}, "name": ${e.name}
     "Gender": ${e.Gender},
     "Eye color": ${e["Eye color"]},
     "Race": ${e.Race},
     "Hair color": ${e["Hair color"]},
     "Height": ${e.Height},
     "Publisher": ${e.Publisher},
     "Skin color": ${e["Skin color"]},
     "Alignment": ${e.Alignment},
     "Weight": ${e.Weight}}`
     item.appendChild(document.createTextNode(hero));
     l.appendChild(item);
    
        })
          
        }))
}
function getPowers(){
    const id=document.getElementById("powerSearchId").value;
    fetch(`/api/heros/${id}/powers`)
    .then(res=>{
       if(res.ok){
           document.getElementById("status").innerText=""
           res.json()
           .then(data=>{const l=document.getElementById('displayList');
           l.innerHTML=""
           data.forEach(e=>{ const item=document.createElement('li');
           console.log(e)
           item.appendChild(document.createTextNode(e.toString()));
           l.appendChild(item);
       
       })

           })
           .catch(err=>{console.log(err)});
       }
       else{
           l=document.getElementById('displayList');
           l.innerHTML=""
           document.getElementById("status").innerText="Cannot find Hero"
       }
})
}
function newList (){
    const name=document.getElementById('newListName').value
    const heroIds = document.getElementById('newListItems').value.split(' ').map(Number);

    // Create the body of the request
    const body = { id: heroIds };

    // Perform the fetch request
    fetch(`/api/heros/list/${name}/add`, {
        method: 'PUT', // Assuming your backend expects a PUT request
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(res =>{
        if(res.ok){
            document.getElementById("status").innerText=""
            res.json()
            .then(data=>{const l=document.getElementById('displayList');
            l.innerHTML=""
            console.log(data)
            data.forEach(e=>{ 
    const item=document.createElement('li');
     console.log(item);
     const hero=`{"id": ${e.id}, "name": ${e.name}
     "Gender": ${e.Gender},
     "Eye color": ${e["Eye color"]},
     "Race": ${e.Race},
     "Hair color": ${e["Hair color"]},
     "Height": ${e.Height},
     "Publisher": ${e.Publisher},
     "Skin color": ${e["Skin color"]},
     "Alignment": ${e.Alignment},
     "Weight": ${e.Weight},
     "Super Powers": ${e.superPowers}
    }`
     item.appendChild(document.createTextNode(hero));
     l.appendChild(item);
        
        })
 
            })
            .catch(err=>{console.log(err)});
        }
        else{
            console.log(res.statusText)
            l=document.getElementById('displayList');
            l.innerHTML=""
            document.getElementById("status").innerText="Cannot create list"
        }} 
        )
}
function deleteList() {
    const name = document.getElementById('deleteListName').value;
    fetch(`/api/heros/list/${name}/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if(res.ok) {
            return res.json(); 
        } else {
            throw new Error('Cannot delete list');
        }
    })
    .then(data => {
        const listElement = document.getElementById('displayList');
        listElement.innerHTML = "";
        const messageNode = document.createTextNode(data.message);
        listElement.appendChild(messageNode);
    })
    .catch(err => {
        console.error(err);
        document.getElementById('displayList').innerHTML = "";
        document.getElementById("status").innerText = err.message;
    });
}
function viewList() {
    const name = document.getElementById('viewListName').value;
    fetch(`/api/heros/list/${name}`)
    .then(res => {
        if(res.ok) {
            return res.json(); 
        } else {
            throw new Error('Cannot view list');
        }
    })
    .then(data => {
        const listElement = document.getElementById('displayList');
        listElement.innerHTML = "";

        data.heros.forEach(hero => {
            const heroAttributes = [];

            for (const key in hero) {
                if (hero.hasOwnProperty(key)) {
                    heroAttributes.push(`${key}: ${hero[key]}`);
                }
            }

            const heroItem = document.createElement('li');
            heroItem.textContent = heroAttributes.join(', ');
            listElement.appendChild(heroItem);
        });
    })
    .catch(err => {
        console.error(err);
        document.getElementById('displayList').innerHTML = "";
        document.getElementById("status").innerText = err.message;
    });
}
