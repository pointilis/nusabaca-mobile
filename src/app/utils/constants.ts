export enum Statuses {
    Idle = 'idle',
    Loading = 'loading',
    Success = 'success',
    Failure = 'failure'
}

export enum StorageKeys {
    SignUpData = 'signupData',
}

export const languages: { code: string; name: string; }[] = [
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'en', name: 'English' },
];