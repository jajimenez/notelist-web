export class NotePreview {
    constructor(
        public id: string = "",
        public title: string | null = null,
        public tags: string[] | null = null
    ) {}
}

export class Note {
    constructor(
        public id: string = "",
        public title: string | null = null,
        public body: string | null = null,
        public tags: string[] | null = null,
        public created: string | null = null,
        public lastModified: string | null = null
    ) {}
}
