import { Subscription } from "rxjs";

export interface SignupModel {
    sub: Subscription |null ,
    error: string|null,
    loading: boolean,
    data: {
        first_name: string|null,
        last_name: string| null,
        email: string |null,
        password: string |null
    }
}
