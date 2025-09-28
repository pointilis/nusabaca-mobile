export enum Endpoints {
    SignUp = '/_allauth/app/v1/auth/provider/token.json',
    Collections = '/tracker/v1/collections.json',
    RetrieveCollection = '/tracker/v1/collections/:id.json',
    AudiobookPages = '/audiobook/v1/pages.json',
    RetrieveAudiobookPage = '/audiobook/v1/pages/:id.json',
}