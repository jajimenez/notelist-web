export class Notebook {
    constructor(
        public id: string = "",
        public name: string = "",
        public tagColors: {[id: string]: string} | undefined = undefined,
        public createdTs: string | undefined = undefined,
        public lastModifiedTs: string | undefined = undefined
    ) {}
}
