export function extractQueryParams(query) {
    const queryParams = {}
    const params = new URLSearchParams(query)

    for(const [key, value] of params) {
        queryParams[key] = value
    }

    return queryParams
}