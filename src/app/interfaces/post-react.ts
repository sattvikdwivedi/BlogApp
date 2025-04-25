import { Subscription } from "rxjs";

export interface PostReact {
    sub: Subscription |null,
    error: string |null,
    loading: boolean ,
    body: {
        blogId: string |null,
        reactName: string |null
    }
}
