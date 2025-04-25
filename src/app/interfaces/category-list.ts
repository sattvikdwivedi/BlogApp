import { Subscription } from "rxjs";

export interface CategoryList {
    sub: Subscription | null,
    error: string | null,
    loading: boolean ,
    items: {
        _id: string,
        name: string,
        count?: number
    }[]
}
