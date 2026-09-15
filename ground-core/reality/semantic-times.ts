/** Strip only an explicitly written leading timestamp/adjunct, never the following clause. */
export function stripDeclaredTimePrefix(text:string):string {
 return text.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})(?:には|に|時点では|時点で)?\s*/,'');
}
