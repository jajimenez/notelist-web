export class User {
    constructor(
        public id: string,
        public username: string,
        public admin: boolean,
        public enabled: boolean,
        public name: string,
        public email: string,
        public created_ts: number,
        public last_modified_ts: number
    ) {}
}
