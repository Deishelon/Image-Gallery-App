export const GALLERY_API = "https://picsum.photos/list"

export function constructImageURL(width, height, id) {
    return `https://picsum.photos/${width}/${height}?image=${id}`
}

export const apiResult = {
    OK: 'ok',
    PROGRESS: 'loading',
    ERR: 'error',
}