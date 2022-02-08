export class Tag {
    constructor(
        public name: string = "",
        public color: string | null = null
    ) {}
}

export class NotePreview {
    constructor(
        public id: string = "",
        public title: string | null = null,
        public tags: Tag[] = []
    ) {}
}

export class Note {
    constructor(
        public id: string = "",
        public title: string | null = null,
        public body: string | null = null,
        public tags: Tag[] = [],
        public created: string | null = null,
        public lastModified: string | null = null
    ) {}
}
