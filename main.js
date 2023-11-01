//Example fetch using pokemonapi.co

document.querySelector("#button").addEventListener("click", () => {
  newComparison.fetchPoke1Data();
});

document.body.addEventListener("keydown", e => {
  if(e.key === "Enter") {
    document.querySelector("#button").click();
  }
});


class ComparePokemonTypes {

  constructor() {
    this.poke1Types = [];
    this.poke2Types = [];
  }

  fetchPoke1Data() {

    const choice = document.querySelector("#poke1").value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${choice}`;
    fetch(url)
      .then(response => response.json())
      .then(async data => {
        console.log("Poke 1 data: ", data)

        this.poke1Types = data.types;
      
        this.createLIElements(this.poke1Types, "pokeUL1");

        const poke1Image = data.sprites.other["official-artwork"].front_default;
        this.showPokeImage(poke1Image, "pokeImg1");

        await this.fetchPoke2Data();

        this.showDmgRelations(this.poke1Types, this.poke2Types, "desc1"); // => I need type1, type2, x2 and x1/2 dmg

      })
      .catch(error => {
        console.log("Error: ", error)
      })
  };

  fetchPoke2Data() {

    const choice = document.querySelector("#poke2").value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${choice}`;
    return fetch(url)
      .then(response => response.json())
      .then(async data => {
        console.log("Poke 2 data: ",data)

        this.poke2Types = data.types;
        this.createLIElements(this.poke2Types, "pokeUL2");

        const poke2Image = data.sprites.other["official-artwork"].front_default;
        this.showPokeImage(poke2Image, "pokeImg2");

        this.showDmgRelations(this.poke2Types, this.poke1Types, "desc2");

      })
      .catch(error => {
        console.log("Error: ", error)
      })
  };

  createLIElements(array, id) {
    const parentULElement = document.querySelector(`#${id}`)
    array.forEach(typeObj => {
      const newULElement = document.createElement("li");
      newULElement.textContent = typeObj.type.name.charAt(0).toUpperCase() + typeObj.type.name.slice(1);
      parentULElement.appendChild(newULElement);
    });
  };

  createPElements(msg, id) {
    const parentElement = document.querySelector(`#${id}`)
    const newElement = document.createElement("p");
    newElement.innerHTML = msg;
    parentElement.appendChild(newElement);
  }

  showPokeImage(imageUrl, imgId) {
    document.querySelector(`#${imgId}`).src = imageUrl;
  };

  showDmgRelations(attackingTypes, defendingTypes, descriptionId) {

    console.log("call id : ", descriptionId)
    console.log("defending types data: ", defendingTypes)

    attackingTypes.forEach(typeObj => {
      console.log("TYPE OBJ: ",typeObj)
      fetch(typeObj.type.url)
      .then(res => res.json())
      .then(data => { 

        console.log("Data for attacking type: ", data);
        
        defendingTypes.forEach(typeObj => {

          console.log("defending type: ", typeObj.type.name)

          let isNormalDmg = true;

          data.damage_relations.double_damage_to.forEach(dd => {
            if(dd.name.includes(typeObj.type.name)) {
            
                const doubleDamageMsg = `${data.name.toUpperCase()} attacks do <span class="doubleDMG">DOUBLE</span> damage to ${typeObj.type.name.toUpperCase()} type pokemon.`;
                this.createPElements(doubleDamageMsg, descriptionId);

                console.log(data.name, "does DOUBLE damage to ", typeObj.type.name )

              isNormalDmg = false;
            } 
          })

          data.damage_relations.half_damage_to.forEach(hd => {
            if(hd.name.includes(typeObj.type.name)) {
              const halfDamageMsg = `${data.name.toUpperCase()} attacks do <span class="halfDMG">HALF</span> damage to ${typeObj.type.name.toUpperCase()} type pokemon.`;
              this.createPElements(halfDamageMsg, descriptionId);
              console.log(data.name, " does HALF damage to ", typeObj.type.name) 
              
              isNormalDmg = false;
            }
          })
            
          if(isNormalDmg) {
            const normalDamageMsg = `${data.name.toUpperCase()} attacks do <span class="normalDMG">NORMAL</span> damage to ${typeObj.type.name.toUpperCase()} type pokemon.`;
            this.createPElements(normalDamageMsg, descriptionId);

            console.log(data.name, "does NORMAL damage to ", typeObj.type.name )
          }
        })
      })
      .catch(error => {
        console.log("Error: ", error);
      })
    })
  
  } 
  
}

const newComparison = new ComparePokemonTypes();

