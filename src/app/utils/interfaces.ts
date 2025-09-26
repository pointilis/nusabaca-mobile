export interface ISignUp {
    provider: string;
    process: string;
    token: {
        id_token: string;
        client_id: string;
    }
}

export interface IInsertBibilo {
    title: string;
    total_pages: number;
    publication_year: number;
    authors?: string[];
    publishers?: string[];
}

export type IPagination = {
    limit: number;
    offset: number;
}

export interface IPageFile {
    page_file: string; // Assuming this is a file path or URL
    page_number: number;
    biblio_collection: string;
    language: string;
    voice_gender: string;
}