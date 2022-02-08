export class User {
    constructor(
        public id: string = "",
        public username: string = "",
        public admin: boolean = false,
        public enabled: boolean = false,
        public name: string | null = null,
        public email: string | null = null,
        public createdTs: string | null = null,
        public lastModifiedTs: string | null = null
    ) {}
}
