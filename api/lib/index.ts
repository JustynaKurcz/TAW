import App from './app';
import IndexController from "./controllers/index.controller";
import PostController from "./controllers/data.controller";
import UserController from "./controllers/user.controller";

const app: App = new App([
    new UserController(),
    new PostController(),
    new IndexController()
]);

app.listen();

