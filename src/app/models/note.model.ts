export class Tag {
    constructor(
        public name: string = "",
        public color: string | null = null
    ) {}
}

export class NotePreview {
    constructor(
        public id: string = "",
        public title: string = "",
        public tags: Tag[] = []
    ) {}
}

export class Note {
    constructor(
        public id: string = "",
        public title: string = "",
        public body: string = "",
        public tags: Tag[] = [],
        public created: string = "",
        public lastModified: string = ""
    ) {}
}
