import { Subscription } from "rxjs";

export interface CategoriesModel {
    sub: Subscription | null,
    error: string|null,
    loading: boolean,
    items: {
        _id: string,
        name: string,
        count: number
    }[],
    totalBlogs: number,
    currentCategoryId: string
}
