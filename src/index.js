let addToy = false;
let toyCollection = document.querySelector('#toy-collection')
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");
const form = document.querySelector('form')

const toyCard = (toys) => {
      const card = document.createElement('div')
      const name = document.createElement('h2')
      const img = document.createElement('img')
      const p = document.createElement('p')
      const btn = document.createElement('button')
      
      card.classList = 'card'
      
      name.innerText = toys.name
      
      img.classList = 'toy-avatar'
      img.src = toys.image

      p.innerText = toys.likes + ' likes'
      p.id = toys.id

      btn.classList = 'like-btn'
      btn.id = toys.id
      btn.innerText = 'Like ❤️'

      toyCollection.appendChild(card)
      card.appendChild(name)
      card.appendChild(img)
      card.appendChild(p)
      card.appendChild(btn)
      


}

const fetchToy = () => {
    fetch('http://localhost:3000/toys')
      .then(resp => resp.json())
      .then(toys => {
        toys.forEach(toy => {
          toyCard(toy)
      })
    likeUpdate()        
    })
}

const submitNewToy = () => {
    toyFormContainer.addEventListener('submit', (e) => {
      e.preventDefault()
      name = `${e.target.name.value}`
      image = `${e.target.image.value}`
      addPostToy(name, image)
      form.reset()
      toyFormContainer.style.display = "none"
    })
}

const addPostToy = (name, image) => {
    fetch('http://localhost:3000/toys', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        "name": name,
        "image": image,
        "likes": 0
      })
    })
      .then(resp => resp.json())
      .then(newToy => toyCard(newToy))
    likeUpdate()
}

const likeUpdate = () => {
  const btnLikes = document.getElementsByClassName('like-btn')
  for(btn of btnLikes) {
    btn.addEventListener('click', (e) => {
      let likes 
      fetch(`http://localhost:3000/toys/${e.target.id}`)
        .then(resp => resp.json())
        .then(toyLikes => {
          let selectedToyLike = toyLikes.likes
          let addLike = selectedToyLike + 1
          fetch(`http://localhost:3000/toys/${e.target.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              "likes": addLike
            })
          })
          .then(resp => resp.json())
          .then(updatedLike => {
            let p = document.getElementById(e.target.id)
            p.innerText = updatedLike.likes + " likes"
          })
        })
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  fetchToy()
  submitNewToy()
  likeUpdate()
})