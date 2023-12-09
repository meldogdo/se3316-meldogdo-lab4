const express = require ('express');
const { MongoClient } = require('mongodb');
const secretKey = "Momo137910111@@@$$$";
const Joi = require('joi');
const fs = require('fs');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
app.use(cors());
const port = 4000;
const storage=[]
const bcrypt = require('bcrypt');
const route = express.Router();
const superheros = require('./superhero_info.json');
const powers = require('./superhero_powers.json');
app.use(express.static('../client'));
app.use("/api/heros",route)
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);
const superheroInfo = JSON.parse(fs.readFileSync('./superhero_info.json', 'utf8'));
const superheroPowers = JSON.parse(fs.readFileSync('./superhero_powers.json', 'utf8'));

function integratePowers(info, powers) {
    const powersDict = powers.reduce((acc, heroPowers) => {
        acc[heroPowers.hero_names] = heroPowers;
        return acc;
    }, {});
    return info.map(hero => {
        hero.superPowers = Object.entries(powersDict[hero.name] || {})
            .filter(([power, value]) => value === 'True')
            .map(([power, _]) => power);
        return hero;
    });
}

const integratedSuperheroes = integratePowers(superheroInfo, superheroPowers);
route.use(express.json());
const crypto = require('crypto');
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = jwt.verify(token, secretKey);
      req.userData = { userId: decodedToken.userId };
      next();
    } catch (error) {
      res.status(401).json({ message: 'Authentication failed!' });
    }
  };
  let db
  
// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db('yourDatabase');
    } catch (e) {
        console.error(e);
        throw e;
    }
}
// Account creation schema
const accountSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    nickname: Joi.string().required()
});


const HeroListSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    heroes: [{ type: String, required: true }], // Assuming heroes are referenced by IDs as strings
    isPrivate: { type: Boolean, default: true },
    lastModified: { type: Date, default: Date.now },
    reviews: [{
        // Define the structure of reviews here
        userId: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String
    }],
    averageRating: { type: Number, default: 0 }
});


route.post('/create-hero-list', async (req, res) => {
    try {
        const { name, description, heroes, isPrivate } = req.body;
        console.log(req.body)
        const newList = new HeroList({
            name,
            description,
            heroes: heroes.split(',').map(heroId => heroId.trim()),
            isPrivate
        });

        await newList.save();
        res.status(201).json(newList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating hero list' });
    }
});
route.get('/hero-lists', async (req, res) => {
    try {
        const heroLists = await HeroList.find({}).sort({ lastModified: -1 }).limit(20).lean();
        res.json(heroLists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching hero lists' });
    }
});


route.post('/create-account', async (req, res) => {
    try {
        const { email, password, nickname } = req.body;
        const { error } = accountSchema.validate({ email, password, nickname });
        if (error) return res.status(400).send(error.details[0].message);

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(16).toString('hex');
        const newAccount = { 
            email, 
            password: hashedPassword, 
            nickname, 
            isVerified: false, 
            verificationToken 
        };

        const database = await connectToMongoDB();
        const accounts = database.collection('accounts');

        const existingAccount = await accounts.findOne({ email });
        if (existingAccount) return res.status(400).send('Email already in use.');

        await accounts.insertOne(newAccount);

        // Generate verification link and print it in the console
        const verificationLink = `http://localhost:${port}/api/heros/verify-email?token=${verificationToken}`;
        console.log(`Verification Link: ${verificationLink}`);

        res.status(201).send('Account created. Please check the console for verification link.');
    } catch (e) {
        console.error(e);
        res.status(500).send('Error creating account');
    }
});
// Route to update password
route.put('/update-password',authMiddleware, async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) {
        return res.status(400).send('All fields are required.');
    }

    const database = await connectToMongoDB();
    const accounts = database.collection('accounts');

    const account = await accounts.findOne({ email });
    if (!account) {
        return res.status(404).send('Account not found.');
    }

    if (!account.isVerified) {
        return res.status(403).send('Account is not verified.');
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isPasswordMatch) {
        return res.status(401).send('Invalid current password.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await accounts.updateOne({ email }, { $set: { password: hashedPassword } });
    res.send('Password updated successfully.');
});




route.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const accounts = db.collection('accounts');
        const account = await accounts.findOne({ email });
        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        if (account.isDisabled) {
            return res.status(403).json({ message: 'Account is disabled. Please contact the administrator.' });
        }

        const isPasswordMatch = await bcrypt.compare(password, account.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        if (!account.isVerified) {
            return res.status(401).json({ message: 'Account is not verified. Please check your email.' });
        }

        // Create a token
        const token = jwt.sign(
            { userId: account._id, email: account.email }, 
            secretKey, 
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.json({ message: 'Logged in successfully.', token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
});

route.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    const database = await connectToMongoDB();
    const accounts = database.collection('accounts');

    const result = await accounts.updateOne({ verificationToken: token }, { $set: { isVerified: true } });
    if (result.modifiedCount === 0) {
        return res.status(404).send('Invalid or expired token.');
    }

    res.send('Email verified successfully.');
});
route.get('/search', authMiddleware,(req, res) => {
    const { name, race, power, publisher } = req.query;
    const filteredHeroes = integratedSuperheroes.filter(hero => {
        const isNameMatch = name ? hero.name.toLowerCase().startsWith(name.toLowerCase()) : true;
        const isRaceMatch = race ? hero.Race.toLowerCase() === race.toLowerCase() : true;
        const isPowerMatch = power ? hero.superPowers.map(p => p.toLowerCase()).includes(power.toLowerCase()) : true;
        const isPublisherMatch = publisher ? hero.Publisher.toLowerCase() === publisher.toLowerCase() : true;
        return isNameMatch && isRaceMatch && isPowerMatch && isPublisherMatch;
    });
    res.json(filteredHeroes);
});

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

connectToMongoDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Listening on port ${port}...`);
        });
    })
    .catch(console.error);