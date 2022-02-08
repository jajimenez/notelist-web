export class AuthUser {
    constructor(
        public accessToken: string,
        public refreshToken: string,
        public userId: string
    ) {}
}
