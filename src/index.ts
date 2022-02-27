import { User } from './User'

const user = new User('Matias', 'Mas', [], [])

console.log(user.getFullName())

console.log(`Number of pets: ${user.countPets()}`)
user.addPet('Lolito')
console.log(`Number of pets: ${user.countPets()}`)

console.log(user.getBookNames())
user.addBook('The name of the wind', 'Patrick Rothfuss')
user.addBook('The way of kings', 'Brandon Sanderson')
console.log(user.getBookNames())
