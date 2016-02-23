export class StringUtils {

    /**
     * format('My {animal} is named {name}.', {animal:'goat',name:'Eric'}) => 'My goat is named Eric.'
		 * Tokens not contained in the dictionary will not be modified.
     */
    public static substitute(s: string, context: any): string {
        for (let token in context) {
            s = s.replace("{" + token + "}", context[token]);
        }
        return s;
    }
}
