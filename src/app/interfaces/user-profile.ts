import { Subscription } from "rxjs";

export interface UserProfile {
    sub?: Subscription | null, // ← allow undefined or null
    error?: string | null,
    loading?: boolean | null,
    data: {
        img?: string | null,
        _id: string |null,
        email?: string |null,
        first_name: string |null,
        last_name?: string |null,
        role: string |null,
        joined?: string|null,
        job?: string|null,
        address?: string|null,
        about?: string|null
    },
    hasReact?: string |null
}
