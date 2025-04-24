import { Subscription } from "rxjs";

export interface  LoginModel {
    sub: Subscription |null ; // avoids null
    error: null,
    loading:boolean | false,
    data: {
        email: null,
        password: null
    }
}


