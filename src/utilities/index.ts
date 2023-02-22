class Utililty {
    static checkEmailOrUsername(payload: string) {
        const regex_pattern =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return regex_pattern.test(payload);
    }

    static trueOrFalse(data: string) {
        switch (data?.toLowerCase()?.trim()) {
            case 'true':
            case 'yes':
            case '1':
                return true;

            case 'false':
            case 'no':
            case '0':
            case null:
            case undefined:
                return false;

            default:
                return JSON.parse(data);
        }
    }
}

export default Utililty;
