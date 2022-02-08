export class Notebook {
    constructor(
        public id: string = "",
        public name: string = "",
        public createdTs: string | null = null,
        public lastModifiedTs: string | null = null
    ) {}
}
