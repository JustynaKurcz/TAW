import Controller from '../interfaces/controller.interface';
import {NextFunction, Request, Response, Router} from 'express';
import {checkPostCount} from "../middlewares/checkPostCount.middleware";
import DataService from "../modules/services/data.service";


class PostController implements Controller {
    public path = '/api/post';
    public router = Router();
    public dataService = new DataService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, this.addPost);
        this.router.get(`${this.path}s`, this.getAll);
        this.router.get(`${this.path}/:id`, this.getPost);
        this.router.delete(`${this.path}/:id`, this.deletePost);
     //   this.router.post(`${this.path}/:num`, checkPostCount, this.getNthPost);
        this.router.delete(`${this.path}s`, this.deleteAll);
    }

    private addPost = async (request: Request, response: Response, next: NextFunction) => {
        const {title, text, image} = request.body;
        const readingData = {title, text, image};

        try {
            await this.dataService.createData(readingData);
            response.status(201).json(readingData);
        } catch (error) {
            console.log('eeee', error)
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({error: 'Invalid input data.'});
        }
    }

    private deleteAll = async (request: Request, response: Response) => {
        await this.dataService.deleteData({});
        response.status(204).send();
    }

    private getAll = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const allData = await this.dataService.query({});

            response.status(200).json(allData);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(500).json({error: 'Internal Server Error'});
        }
    }

    private getPost = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const {id} = request.params;

            const allData = await this.dataService.getById({_id: id});
            response.status(200).json(allData);
        } catch (error) {
            console.log(`Not found: ${error.message}`);
            response.status(404).json({error: 'Not found'});
        }
    }

    private deletePost = async (request: Request, response: Response, next: NextFunction) => {
       try {
           const {id} = request.params;
           await this.dataService.deleteSingleData({_id: id});
           response.sendStatus(204);
       } catch (error) {
              console.error(`Not found: ${error.message}`);
              response.status(404).json({error: 'Not found'});
       }
    };
}

export default PostController;
