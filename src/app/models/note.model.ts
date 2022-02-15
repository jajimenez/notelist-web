export class NotePreview {
    constructor(
        public id: string = "",
        public notebookId: string = "",
        public archived: boolean = false,
        public title: string = "",
        public tags: string[] = [],
        public created: string = "",
        public lastModified: string = ""
    ) {}
}

export class Note {
    constructor(
        public id: string = "",
        public notebookId: string = "",
        public archived: boolean = false,
        public title: string = "",
        public body: string = "",
        public tags: string[] = [],
        public created: string = "",
        public lastModified: string = ""
    ) {}
}
