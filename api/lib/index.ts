import App from './app';
import IndexController from "./controllers/index.controller";
import PostController from "./controllers/data.controller";

const app: App = new App([
    new PostController(),
    new IndexController()
]);

app.listen();

