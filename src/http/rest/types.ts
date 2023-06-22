export type ErrorResponse = {
    error: string,
    data: false
};

export type SuccessIdResponse = {
    error: false,
    data: {
        id: string,
    }
};

export type SuccessEmptyResponse = {
    error: false,
};


