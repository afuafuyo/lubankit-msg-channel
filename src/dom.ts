import type { Callback, Message, Processor } from './types';

/**
 * Dom Event
 *
 * @example
 *
 * ```javascript
 * // iframepage.js
 * MessageChannelDom.listen('getUser', (message, response) => {
 *    response({id: 1, name: 'zhang san', age: 18})
 * })
 * ```
 *
 * ```javascript
 * // page.js
 * MessageChannelDom.sendMessage(iframe.contentWindow, {type: 'getUser', data: 1}, (res) => {
 *    console.log(res)
 * })
 * ```
 */
export default class MessageChannelDom {
    private static uuid: number = 0;
    private static global = globalThis;
    private static processors: Record<string, Processor<any, any>> = {};
    private static callbacks: Record<string, Callback<any>> = {};

    /**
     * The target origin of the message
     */
    static targetOrigin = '*';
    /**
     * The sender origin of the message
     */
    static senderOrigin = '';

    static {
        // MessageChannelDom.global.addEventListener('message', MessageChannelDom.domEntry, false);
        MessageChannelDom.global.onmessage = MessageChannelDom.domEntry;
    }

    private static addCallback(callback: Callback): number {
        MessageChannelDom.uuid++;
        MessageChannelDom.callbacks['cb' + MessageChannelDom.uuid] = callback;
        return MessageChannelDom.uuid;
    }

    private static domEntry(event: MessageEvent): void {
        if(MessageChannelDom.senderOrigin !== '' && event.origin !== MessageChannelDom.senderOrigin) {
            return;
        }

        let msg = event.data as Message<any> & { flag?: number };
        // Prevent processing messages by self
        let flag = msg.flag;
        let sender = event.source;
        let origin = event.origin;

        // 1. Search for the message processor
        const processor = MessageChannelDom.processors[msg.type];
        if(flag !== 1 && processor !== undefined) {
            processor(msg, (result) => {
                sender?.postMessage({
                    flag: 1,
                    type: msg.type,
                    id: msg.id,
                    data: result,
                }, { targetOrigin: origin });
                sender = null;
            });
            return;
        }

        // 2. Search for the message callback
        const callback = MessageChannelDom.callbacks['cb' + msg.id];
        if(flag === 1 && callback !== undefined) {
            delete MessageChannelDom.callbacks['cb' + msg.id];
            callback(msg.data);
        }
    }

    /**
     * Register message processor
     */
    static listen(type: string, processor: Processor): void {
        MessageChannelDom.processors[type] = processor;
    }

    /**
     * Send message to another DOM
     */
    static sendMessage<R>(win: any, message: Message, callback: Callback<R> | null = null): void {
        if(callback !== null) {
            const id = MessageChannelDom.addCallback(callback);
            if(message.id === undefined) {
              message.id = id;
            }
        }
        win.postMessage(message, MessageChannelDom.targetOrigin);
    }
}
