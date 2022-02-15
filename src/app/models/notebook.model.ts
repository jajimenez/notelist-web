export class Notebook {
    constructor(
        public id: string = "",
        public name: string = "",
        public tagColors: {[id: string]: string} = {},
        public createdTs: string = "",
        public lastModifiedTs: string = ""
    ) {}
}
