import Controller from '../interfaces/controller.interface';
import {NextFunction, Request, Response, Router} from 'express';
import UserService from "../modules/services/user.service";
import PasswordService from "../modules/services/password.service";
import TokenService from "../modules/services/token.service";
import EmailService from "../modules/services/email.service";
import {auth} from "../middlewares/auth.middleware";
import generator from "generate-password";
import emailService from "../modules/services/email.service";

class UserController implements Controller {
    public path = '/api/user';
    public router = Router();
    private userService = new UserService();
    private passwordService = new PasswordService();
    private tokenService = new TokenService();
    private emailService = new EmailService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/create`, this.createNewOrUpdate);
        this.router.post(`${this.path}/auth`, this.authenticate);
        this.router.delete(`${this.path}/logout/:userId`, auth, this.removeHashSession);
        this.router.post(`${this.path}/resetPassword`, this.resetPassword);
        this.router.get(`${this.path}/getAllUsers`, this.browseUsers);
        this.router.delete(`${this.path}/removeUser/:userId`, this.removeUserById);
    }

    private authenticate = async (request: Request, response: Response, next: NextFunction) => {
        const {login, password} = request.body;

        try {
            const user = await this.userService.getByEmailOrName(login);
            if (!user) {
                return response.status(401).json({error: 'Unauthorized'});
            }

            const isAuthorized = await this.passwordService.authorize(user.id, password);
            if (!isAuthorized) {
                return response.status(401).json({error: 'Unauthorized'});
            }

            const token = await this.tokenService.create(user);
            return response.status(200).json(this.tokenService.getToken(token));

        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(401).json({error: 'Unauthorized'});
        }
    };

    private createNewOrUpdate = async (request: Request, response: Response, next: NextFunction) => {
        const userData = request.body;

        try {
            const user = await this.userService.createNewOrUpdate(userData);

            if (userData.password) {
                const hashedPassword = await this.passwordService.hashPassword(userData.password);
                await this.passwordService.createOrUpdate({userId: user.id, password: hashedPassword});
                response.status(200).json(user);
            }
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({error: 'Bad request', value: error.message});
        }

    };

    private removeHashSession = async (request: Request, response: Response, next: NextFunction) => {
        const {userId} = request.params;
        try {
            const result = await this.tokenService.remove(userId);
            response.status(200).json(result);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            return response.status(401).json({error: 'Unauthorized'});
        }
    }

    private resetPassword = async (request: Request, response: Response, next: NextFunction) => {
        const {login} = request.body;

        try {
            const user = await this.userService.getByEmailOrName(login);
            if (!user) {
                return response.status(401).json({error: 'Unauthorized'});
            }
            console.log(`User: ${user.email}`);

            const newPassword = generator.generate({length: 10, numbers: true});
            console.log(`New password: ${newPassword}`);
            const hashedPassword = await this.passwordService.hashPassword(newPassword);
            console.log(`Hashed password: ${hashedPassword}`);
            await this.passwordService.createOrUpdate({userId: user.id, password: hashedPassword});
            console.log(`New password: ${newPassword}`);
            // todo: send email with new password
            await this.emailService.sendEmail(
                {
                    recipient: user.email,
                    subject: 'Twoje nowe hasło!',
                    message: newPassword
               })
            console.log('Email sent');
            return response.status(200).json({message: 'New password has been sent to your email'});
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({error: 'Bad request', value: error.message});
        }
    }

    public browseUsers = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const users = await this.userService.browseUsers({});
            response.status(200).json(users);
        } catch (error) {
            console.error(`Browse error: ${error.message}`);
            response.status(500).json({error: 'Error while getting all users'});
        }
    };

    public removeUserById = async (request: Request, response: Response, next: NextFunction) => {
        const {userId} = request.params;
        try {
            await this.userService.removeUserById({userId});
            response.sendStatus(204);
        } catch (error) {
            response.status(404).json({error: 'User with id not found'});
        }
    };
}

export default UserController;
