const insertPressed = async () => {
  try {
    const serverResponse = await fetch("http://localhost:8080/api/pokemon/add", {
      method:"POST",
      body: JSON.stringify({
        name:"Pikachu",
        attack:"Growl"
      }),
      headers: {
        "Content-type":"application/json; charset=UTF-8"
      }
    })
    const responseAsJSON = await serverResponse.json()
    alert("DONE, check browser console for server response")
    console.log(responseAsJSON)

  } catch (err) {
    alert("Error occurred, check browser console")
    console.log(err)
  }
}



const getPressed = async() => {
  try {
    const result = await fetch("http://localhost:8080/api/pokemon/all")
    const resultAsJSON = await result.json()

    let output = ""
    for (let currPoke of resultAsJSON) {
      output += `
        <p>Pokedex ID: ${currPoke.pokedexId}</p>
        <p>ID from database: ${currPoke._id}</p>
        <p>${currPoke.name}</p>
        <img src="${currPoke.img}"/>
        <hr/>
      `
    }

    document.querySelector("#results").innerHTML = output

  } catch (err) {

  }
}
document.querySelector("#btnInsert").addEventListener("click", insertPressed)
document.querySelector("#btnGetPokemon").addEventListener("click", getPressed)



