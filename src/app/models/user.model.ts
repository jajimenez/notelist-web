export class User {
    constructor(
        public id: string = "",
        public username: string = "",
        public admin: boolean = false,
        public enabled: boolean = false,
        public name: string | undefined = undefined,
        public email: string | undefined = undefined,
        public createdTs: string | undefined = undefined,
        public lastModifiedTs: string | undefined = undefined
    ) {}
}
