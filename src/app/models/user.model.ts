export class User {
    constructor(
        public id: string = "",
        public username: string = "",
        public admin: boolean = false,
        public enabled: boolean = false,
        public name: string = "",
        public email: string = "",
        public createdTs: string = "",
        public lastModifiedTs: string = ""
    ) {}
}
