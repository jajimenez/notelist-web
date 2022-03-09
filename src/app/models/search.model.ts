export class NotebookSearchResult {
    constructor(
        public id: string = "",
        public name: string = "",
        public tagColors: {[id: string]: string} = {},
        public created: string = "",
        public lastModified: string = ""
    ) {}
}

export class NoteSearchResult {
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

export class SearchResult {
    constructor(
        public notebooks: NotebookSearchResult[] = [],
        public notes: NoteSearchResult[] = []
    ) {}
}
