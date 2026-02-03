import "./styles/styles.scss";

import * as bootstrap from 'bootstrap';

// Import all of Bootstrap’s JS


import {Router} from "./router.js";

class App{
    constructor(){
    new Router();
    console.log("App started");
    }
}

(new App());