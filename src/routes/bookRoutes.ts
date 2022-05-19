import {Request, Response, Router} from "express"

import Book from "../models/Book"

class BookRoutes {
    public router: Router
    constructor() {
         this.router = Router()
        this.routes()
    }

    public async getBooks(req: Request, res: Response) : Promise<void> {
        const allBooks = await Book.find()
        if (allBooks.length == 0){
            res.status(404).send("There are no books yet!")
        }
        else{
            res.status(200).send(allBooks)
        }
    }

    public async getBookByName(req: Request, res: Response) : Promise<void> {
        const bookFound = await Book.findOne({tite: req.params.title})
        if(bookFound == null){
            res.status(404).send("The book doesn't exist!")
        }
        else{
            res.status(200).send(bookFound)
        }
    }

    public async addBook(req: Request, res: Response) : Promise<void> {
        console.log(req.body)
        const {title, category,ISBN,publicationDate,format,quantity,sells,description} = req.body
        const newBook = new Book({title, category,ISBN,publicationDate,format,quantity,sells,description})
        await newBook.save()
        res.status(200).send("Book added!")
    }

    public async updateBook(req: Request, res: Response) : Promise<void> {
        const bookToUpdate = await Book.findOneAndUpdate ({title: req.params.title}, req.body)
        if(bookToUpdate == null){
            res.status(404).send("The book doesn't exist!")
        }
        else{
            res.status(200).send("Updated!")
        }
    }

    public async deleteBook(req: Request, res: Response) : Promise<void> {
        const bookToDelete = await Book.findOneAndDelete ({title:req.params.title}, req.body)
        if (bookToDelete == null){
            res.status(404).send("The book doesn't exist!")
        }
        else{
            res.status(200).send("Deleted!")
        }
    } 
    routes() {
        this.router.get("/", this.getBooks)
        this.router.get("/:title", this.getBookByName)
        this.router.post("/", this.addBook)
        this.router.put("/:title", this.updateBook)
        this.router.delete("/:title", this.deleteBook)
    }
}
const bookRoutes = new BookRoutes()

export default bookRoutes.router