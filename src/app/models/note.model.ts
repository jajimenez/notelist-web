export class NotePreview {
    constructor(
        public id: string = "",
        public notebookId: string = "",
        public archived: boolean = false,
        public title: string | undefined = undefined,
        public tags: string[] | undefined = undefined,
        public created: string | undefined = undefined,
        public lastModified: string | undefined = undefined
    ) {}
}

export class Note {
    constructor(
        public id: string = "",
        public notebookId: string = "",
        public archived: boolean = false,
        public title: string | undefined = undefined,
        public body: string | undefined = undefined,
        public tags: string[] | undefined = undefined,
        public created: string | undefined = undefined,
        public lastModified: string | undefined = undefined
    ) {}
}
