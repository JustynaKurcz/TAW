import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';

let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

class PostController implements Controller{
    public path = '/api/post';
    public router = Router();

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, this.addPost);
        this.router.get(`${this.path}s`, this.getAll);
        this.router.get(`${this.path}/:id`, this.getPost);
        this.router.delete(`${this.path}/:id`, this.deletePost);
        this.router.post(`${this.path}/:num`, this.getNthPost);
        this.router.delete(`${this.path}s`, this.deleteAll);
    }

    private addPost(request: Request, response: Response) {
        testArr.push(request.body);
        response.status(201).send(`Added ${request.body}`);
    }

    private getAll = async (response: Response) => {
        response.status(200).json(testArr);
    };

    private getPost(request: Request, response: Response) {
        const id = Number(request.params.id);
        if (!Number.isInteger(id) || id >= testArr.length || id < 0) {
            response.status(400).json({ exception: 'Invalid ID' });
            return;
        }
        response.status(200).json(testArr[id]);
    }

    private deletePost(request: Request, response: Response) {
        const id = Number(request.params.id);
        if (!Number.isInteger(id) || id >= testArr.length || id < 0) {
            response.status(400).json({ exception: 'Invalid ID' });
            return;
        }
        testArr.splice(id, 1);
        response.status(204).send();
    }

    private getNthPost(request: Request, response: Response) {
        const num = parseInt(request.params.num);
        const posts = testArr.slice(0, num);
        response.status(200).json(posts);
    }

    private deleteAll(request: Request, response: Response) {
        testArr = [];
        response.status(204).json(testArr);
    }
}

export default PostController;
