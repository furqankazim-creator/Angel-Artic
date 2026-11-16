/** File-name key for a word or phrase: "ice cream" becomes "ice_cream". Voice clips and illustrations use it. */
export const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
