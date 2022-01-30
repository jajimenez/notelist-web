export class AuthUser {
    constructor(
        public access_token: string,
        public refresh_token: string,
        public user_id: string
    ) {}
}
