export type Record = {
    id: string

    created_at: string
    updated_at: string | null
    deleted_at: string | null

    // [key: string]: string | number | boolean | null
}
