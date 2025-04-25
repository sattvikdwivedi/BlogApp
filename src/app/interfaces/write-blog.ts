import { Subscription } from "rxjs";

export interface WriteBlog {
    sub: Subscription | null,
    error: string | null,
    loading: boolean,
    data: {
        title: string| null,
        category: string| null,
        body: string| null,
        img: string| null,
    }
}
