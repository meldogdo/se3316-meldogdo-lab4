const express = require ('express');
const Joi = require('joi')
const app = express();
const port = 3000;
const storage=[]
const route = express.Router();
const superheros = require('./superhero_info.json');
const powers = require('./superhero_powers.json');
app.use(express.static('../client'));
app.use("/api/heros",route)
route.use(express.json());
    

route.get('/powers/:n/:power',(req, res) =>{
    const p=req.params.power
    const n=req.params.n
    const results=[]
    let i=true
    let x=0
    const schema = Joi.object({
        n:Joi.number().integer().max(733).min(0) ,
        k:Joi.string().required()

    });
    const objectToValidate = {
        n: n,
        k: p
      };
            
      // Now validate the constructed object
      const result = schema.validate(objectToValidate);
    if(result.error){
        res.status(404).send(result.error.details[0].message);
        console.log(result.error.message)
    return;
    }
    else{
        if(n!=0){
    for(let s of superheros){
        const power=powers.find(c=> c.hero_names===s.name)
        const powerList=[]
            for(let pow in power){
          if(power[pow] === "True"){
            powerList.push(pow)
            
          }
          s.superPowers=powerList
        }
        for(let k in powerList){
            if(powerList[k]===p){
                results.push(s)
                x++;
                if(x>=n){
                    break;
                }
            }
          }
          if (x >=n) {
            break;
        }
    }
    
   
}
else if(n==0){
    for(let s of superheros){
        const power=powers.find(c=> c.hero_names===s.name)
        const powerList=[]
            for(let pow in power){
          if(power[pow] === "True"){
            powerList.push(pow)
          }
          s.superPowers=powerList
        }
        for(let k in powerList){
            if(powerList[k]===p){
                results.push(s)
            }
          }
    
    }
    
    
   
}
if(results.length==0){
    res.status(400).send("Power Not Found")
}
else{
    res.send(results)
}
    }
})
route.get('/:id', (req, res) => {
        const value = req.params.id;
        const result=[]
        // This will be true if `value` is a string that can be parsed as a number
        const looksLikeNumber = !isNaN(parseFloat(value)) && isFinite(value);
    
        // This will be true if `value` is strictly a string
        // and not a string that looks like a number
        const isStrictString = isNaN(Number(value));
          
        if (looksLikeNumber && !isStrictString) {

            for(let i of superheros){
                if(i.id.toString().includes(value.toString())){
                    result.push(i)
                }
                
            }
        if(result.length > 0){
            res.send(result)
        }
        else {
           
                res.status(404).send(`Superhero was not found`);
        }
        } else if(isNaN(Number(value))){
            for(let i of superheros){
                if(i.name.includes(value)){
                    result.push(i)
                }
            }
            if(result.length > 0){
                res.send(result)
            }
            else {
               
                    res.status(404).send(`Superhero was not found`);
            }
        }
    else{
        res.status(400).send(`Superhero field was empty or had no characters or numbers`);
    }
});
//////duplication ***fix later***
route.get('/:id/powers', (req, res) => {
    const id = req.params.id;
    const schema = Joi.object({
        id: Joi.number().integer().min(0).max(733).required()
    });

    const objectToValidate = {
        id: id
      };
      
      // Now validate the constructed object
      const result = schema.validate(objectToValidate);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        console.log(result.error.message)
    return;
    }
else{
    const hero= superheros.find(p => p.id === parseInt(id));
    const powerList=[]
    if(hero){
        const power=powers.find(c=> c.hero_names===hero.name)
        for(let pow in power){
      if(power[pow] === "True"){
        powerList.push(pow)
      }
}
res.send(powerList)
}
    else{
        res.status(404).send(`Superhero with id ${id} not found!`);
    }
}

});
route.get('/:n/:pattern/:field', (req, res) => {
    var n = req.params.n;
    var field = req.params.field;
    var pattern = req.params.pattern;
    const list=[];
    var x=0
    
    const schema = Joi.object({
        number: Joi.number().integer().min(0).max(733),
        p:Joi.alternatives().try(Joi.number().integer(), Joi.string()).required(),
        f:Joi.string().required()

    });
    const objectToValidate = {
        number: isNaN(parseInt(n, 10)) ? undefined : parseInt(n, 10),
        f: field,
        p: pattern
      };
            
      // Now validate the constructed object
      const result = schema.validate(objectToValidate);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        console.log(result.error.message)
    return;
    }
    
    else{
    if(n==0){
        for(let p of superheros){
            if(p[pattern]==field){
                console.log(n)
                console.log(p[pattern])
                list.push(p)
            }
            }
        
    }
    else {
        for(let p of superheros){
        if(p[pattern]==field){
            if(x<n){
            console.log(p[pattern])
            list.push(p)
            x++
        }
        }
    
    }
console.log(x)
}
res.send(list)
    }
});

route.get('/publisher/all', (req, res) => {
const publisherList=[];

for(let i of superheros){
    const foundthem=publisherList.find(x => x===i.Publisher)
    if(!foundthem && i.Publisher!==""){
    publisherList.push(i.Publisher)
}
}
res.send(publisherList)
})
route.put('/list/:name/add', (req, res) => {
    const b = req.body;
    var n=req.params.name;
    const list=[];
    const schema = Joi.object({
        id: Joi.required()})
        const objectToValidate={id: b.id}
        const result = schema.validate(objectToValidate);
        if(result.error){
            res.status(400).send(result.error.details[0].message);
        return;
    }
    else{
    for(let i in b.id){
    const heroIndex=superheros.findIndex(p=>p.id===parseInt(b.id[i]));
    const hero= superheros.find(p => p.id === parseInt(b.id[i]));
    if (!hero) {
        // If a hero with the given ID is not found, send an error message
        return res.status(404).send({ message: `Superhero with ID ${heroId} not found.` });
    }
    const power=powers.find(c=> c.hero_names===hero.name)
    if (!power) {
        // If powers for the hero is not found, send an error message
        return res.status(404).send({ message: `Powers for superhero ${hero.name} not found.` });
    }
    console.log(power)
    
    const superheroic=superheros[heroIndex]
    console.log(superheroic)
list.push(superheroic)
console.log(list)
for(let superheros of list){
    const power=powers.find(c=> c.hero_names===superheros.name)
    const powerList=[]
        for(let pow in power){
      if(power[pow] === "True"){
        powerList.push(pow)
      }
      superheros.superPowers=powerList
    }

}
}
const storageIndex = storage.findIndex(entry => entry.name === n);
if(storageIndex>-1){
    storage[storageIndex].heros = list;
}
else{
    storage.push({ name: n, heros: list });
}
    res.send(list)
}
});
route.get('/list/:n',(req, res)=>{
    const listName=req.params.n
    console.log(listName)
    let found = false
    for(let i of storage){
        if(i.name === listName){
            found = true
          for(let superheros of i.heros){
            const power=powers.find(c=> c.hero_names===superheros.name)
            const powerList=[]
                for(let pow in power){
              if(power[pow] === "True"){
                powerList.push(pow)
              }
              superheros.superPowers=powerList
            }
     
    }
res.send(i)
break; 
}   
}
if (found==false) {
    // If the list was not found, send a 404 response with a message
    res.status(404).send(`List named '${listName}' was not found.`);
}
});
route.delete('/list/:n/delete',(req, res)=>{
    const listName=req.params.n
    console.log(listName)
    const deleteIndex = storage.findIndex(entry => entry.name === listName);
    if (deleteIndex !== -1) {
        storage.splice(deleteIndex, 1); // Remove one item at the deleteIndex position
        res.send({ message: 'List deleted successfully' });
    } else {
        // If the item wasn't found, send a 404 response
        res.status(404).send({ message: 'List not found' });
    }
});

app.listen (port,() =>{
    console.log(`Listening on port ${port}...`);
});