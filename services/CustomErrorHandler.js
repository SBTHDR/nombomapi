class CustomErrorHandler extends Error {
    constructor(status, msg) {
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message) {
        return new CustomErrorHandler(409, message);
    }

    static invalidCredentials(message = 'User name or password is invalid') {
        return new CustomErrorHandler(401, message);
    }
}

export default CustomErrorHandler;