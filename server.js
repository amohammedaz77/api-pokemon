const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// req.body
app.use(express.urlencoded({ extended: true }));

// ejs
app.set("view engine", "ejs");

// static resources folder
app.use(express.static("public"))

// TODO: add express.json() when you want your server to receive json data sent by a client
app.use(express.json())

// TODO:  add express.urlencoded when you want your server to receive <form> data sent by client
// app.use(express.urlencoded({ extended: true }))

// mongo
const mongoose = require('mongoose');
// TOOD: UPDATE YOUR CONNECTION STRING!
const CONNECTION_STRING 
    = "mongodb+srv://dbUser:Seneca123@cluster0.utiefr8.mongodb.net/?retryWrites=true&w=majority"

const Schema = mongoose.Schema;
const pokemonSchema = new Schema({
  pokedexId: Number,
  name:String,
  type:String,
  attack:Number,
  img:String,
  desc:String    
});
// model - if the collection does not exist in your databse,mongoose will create it.
const Pokemon = mongoose.model("pokemon_collection", pokemonSchema);

// ----------------------------------------------
// endpoints
// ----------------------------------------------

// TODO:
app.get("/", (req,res)=>{
  res.render("index")
})

app.get("/api/pokemon/all", async (req,res)=>{
  try {
    const results = await Pokemon.find().lean().exec()
    return res.status(200).json(results)
  } catch(err) {
    console.log(err)
    return res.status(500).json({message:err})
  }

})

app.get("/api/pokemon/type/:typeToFind", async (req,res)=>{
  const myType = req.params.typeToFind

  try {
    const results = await Pokemon.find({type:myType}).lean().exec()
    return res.status(200).json(results) 
  } catch (err) {
    const errObj = {message:err}
    return res.status(500).json(errObj)
  }
})

// Use Thunderclient or Postman to test
app.post("/api/pokemon/add", async (req, res) => {

  // 1. get the data from the client that should be inserted into the database
  // <form>
  // it coud be from something else (AJAX request)
  // it could be from a server side testing app (Postman, Insomnia)
  console.log("DEBUG: Data from client")
  console.log(req.body)

  try {
    // 2. insert the data into the database
    // req.body.pokedexId
    // - refers to the name of the attributes sent by the lcient
    // new Pokemon({pokedexId:___, name:____, type:_____})
    //  - these spellings refer to the Pokemon schema defined at beginning of this file
    const docToAdd = new Pokemon({
      pokedexId: req.body.pokedexId,
      name:req.body.name,
      type:req.body.type,
      attack:req.body.attack,
      img:req.body.img,
      desc:req.body.desc    
    })
    await docToAdd.save()
    // if the save worked correctly, then mongoose will update docToAdd with the 
    // id it assignment to the inserted docuemnt
    console.log("DEBUG: What was inserted?")
    console.log(docToAdd)
    // 3. respond to the client
    return res.status(201).json({message:`Insert success, created document id is: ${docToAdd._id}`})
  } catch(err) {
    console.log(err)
    return res.status(500).json({message:"ERROR: Check server console for logs"})
  }
}) 

// TO TEST, send data in ThunderClient
app.delete("/api/pokemon/delete/:mongoDocId", async (req,res) => {
  
  try {
    await Pokemon.findOneAndDelete({_id: req.params.mongoDocId})
    return res.status(410).json({message:"Delete success!"})
  } catch(err) {
    console.log(err)
    return res.status(500).json({message:"ERROR: check console for errors"})
  }
  // write the code to delete a pokmeon by id 
  // (pokedexid? mongo _id?)
})


// TO TEST this endpoint, send data in ThunderClient
app.put("/api/pokemon/update/:mongoDocId", async (req, res) => {
  console.log(`Attempting to update ${req.params.mongoDocId}`)
  try {
    // we are directly sending the information from the client to MongoDB
    // This code assumes that the properties in the req.body match spelling and capitalization
    // of the Mongoose Schema listed at beginning of the file
    const result = await Pokemon.findOneAndUpdate({_id: req.params.mongoDocId}, req.body)
    console.log(result)
    return res.status(200).json({message:"Updated success!"})
  } catch(err) {
    console.log(err)
    return res.status(500).json({message:"ERROR: check console for errors"})
  }
})


app.post("/api/test", (req,res)=>{
  console.log("What's in the body")
  console.log(req.body);
  return res.status(418).json({message:"Hello from the POST endpoint!"})
 })

 app.put("/api/test2", (req,res)=>{
  console.log("What's in the body")
  console.log(req.body);
  return res.status(416).json({message:"Hello from the PUT endpoint!"})
 })

 app.delete("/api/test3", (req,res)=>{
  console.log("What's in the body")
  console.log(req.body);
  return res.status(200).json({message:"Hello from the DELETE endpoint!"})
 })
 


// UPDATED CODE:
// - 1. Attempt to connect to MongoDB
// - 2. If successful, THEN start Express.
const onServerStart = () => {
  console.log("Express http server listening on: " + HTTP_PORT);
  console.log(`http://localhost:${HTTP_PORT}`);
 };
 

 const connectDBAndStartServer = async () => {
  try {
    // 1. Attempt to connect to the database. If error, then jump to the catch block
    const conn = await mongoose.connect(CONNECTION_STRING);   
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // 2. If you reach this point, that means the connection to the db was successful
    // 3. Try to start the server
    app.listen(HTTP_PORT, onServerStart)
    // 4. done
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
 }
 
 
 // To execute this code, run the function
 connectDBAndStartServer()
 