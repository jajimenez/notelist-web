export class Notebook {
    constructor(
        public id: string = "",
        public name: string = "",
        public tagColors: {[id: string]: string} | null = null,
        public createdTs: string | null = null,
        public lastModifiedTs: string | null = null
    ) {}
}
