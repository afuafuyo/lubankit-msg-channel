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
var MessageChannelDom = /** @class */ (function () {
    function MessageChannelDom() {
    }
    MessageChannelDom.addCallback = function (callback) {
        MessageChannelDom.uuid++;
        MessageChannelDom.callbacks['cb' + MessageChannelDom.uuid] = callback;
        return MessageChannelDom.uuid;
    };
    MessageChannelDom.domEntry = function (event) {
        if (MessageChannelDom.senderOrigin !== '' && event.origin !== MessageChannelDom.senderOrigin) {
            return;
        }
        var msg = event.data;
        // Prevent processing messages by self
        var flag = msg.flag;
        var sender = event.source;
        var origin = event.origin;
        // 1. Search for the message processor
        var processor = MessageChannelDom.processors[msg.type];
        if (flag !== 1 && processor !== undefined) {
            processor(msg, function (result) {
                sender === null || sender === void 0 ? void 0 : sender.postMessage({
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
        var callback = MessageChannelDom.callbacks['cb' + msg.id];
        if (flag === 1 && callback !== undefined) {
            delete MessageChannelDom.callbacks['cb' + msg.id];
            callback(msg.data);
        }
    };
    /**
     * Register message processor
     */
    MessageChannelDom.listen = function (type, processor) {
        MessageChannelDom.processors[type] = processor;
    };
    /**
     * Send message to another DOM
     */
    MessageChannelDom.sendMessage = function (win, message, callback) {
        if (callback === void 0) { callback = null; }
        if (callback !== null) {
            var id = MessageChannelDom.addCallback(callback);
            if (message.id === undefined) {
                message.id = id;
            }
        }
        win.postMessage(message, MessageChannelDom.targetOrigin);
    };
    MessageChannelDom.uuid = 0;
    MessageChannelDom.global = globalThis;
    MessageChannelDom.processors = {};
    MessageChannelDom.callbacks = {};
    /**
     * The target origin of the message
     */
    MessageChannelDom.targetOrigin = '*';
    /**
     * The sender origin of the message
     */
    MessageChannelDom.senderOrigin = '';
    (function () {
        // MessageChannelDom.global.addEventListener('message', MessageChannelDom.domEntry, false);
        MessageChannelDom.global.onmessage = MessageChannelDom.domEntry;
    })();
    return MessageChannelDom;
}());

export { MessageChannelDom as default };
