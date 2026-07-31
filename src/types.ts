export interface Message<T = any> {
    id?: number;
    type: string;
    data: T;
}

/**
 * The message callback
 */
export type Callback<T = any> = (data: T) => void

/**
 * The message processor
 */
export type Processor<T = any, R = any> = (msg: Message<T>, resultCallback: Callback<R>) => void
