export class User {
    private _firstName: string
    private _lastName: string
    private _books: any[]
    private _pets: string[]

    constructor(firstName: string, lastName: string, books: any[], pets: string[]) {
        this._firstName = firstName
        this._lastName = lastName
        this._books = books
        this._pets = pets
    }

    getFullName(): string {
        return `${this._firstName} ${this._lastName}`
    }

    addPet(petName: string): void {
        this._pets.push(petName)
    }

    countPets(): number {
        return this._pets.length
    }

    addBook(name: string, author: string): void {
        this._books.push({ name: name, author: author })
    }

    getBookNames(): string[] {
        const bookNames: string[] = []

        for (const book of this._books) {
            bookNames.push(book.name)
        }

        return bookNames
    }
}