import Controller from '../interfaces/controller.interface';
import {NextFunction, Request, Response, Router} from 'express';
import DataService from "../modules/services/data.service";
import Joi from "joi";


class PostController implements Controller {
    public path = '/api/data';
    public router = Router();
    public dataService = new DataService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, this.createData);
        this.router.get(`${this.path}s`, this.browseData);
        this.router.get(`${this.path}/:id`, this.getDataById);
        this.router.delete(`${this.path}/:id`, this.removeData);
        this.router.delete(`${this.path}s`, this.removeAllData);
    }

    private createData = async (request: Request, response: Response) => {
        const {title, text, image} = request.body;

        const schema = Joi.object({
            title: Joi.string().required(),
            text: Joi.string().required(),
            image: Joi.string().uri().required()
        });

        try {
            const validatedData = await schema.validateAsync({title, text, image});
            const createdData = await this.dataService.createData(validatedData);
            response.status(201).json({id: createdData._id, ...validatedData});
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({error: 'Invalid input data.'});
        }
    }

    private browseData = async (response: Response) => {
        try {
            const allData = await this.dataService.browseData({});
            response.status(200).json(allData);
        } catch (error) {
            console.error(`Browse error: ${error.message}`);
            response.status(500).json({error: 'Internal Server Error'});
        }
    }

    private getDataById = async (request: Request, response: Response) => {
        const {id} = request.params;
        const data = await this.dataService.getById({id});

        data ?
            response.status(200).json(data) :
            response.status(404).json({error: `Data with id: ${id}  not found`});
    }

    private removeData = async (request: Request, response: Response) => {
        try {
            const {id} = request.params;
            await this.dataService.removeDataById({id});
            response.sendStatus(204);
        } catch (error) {
            response.status(404).json({error: `Data with id not found`});
        }
    };

    private removeAllData = async (request: Request, response: Response) => {
        await this.dataService.removeAllData({});
        response.sendStatus(204);
    }
}

export default PostController;
