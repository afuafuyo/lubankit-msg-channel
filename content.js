/**
 * Content Script
 */
var MessageChannelContent = /** @class */ (function () {
    function MessageChannelContent() {
    }
    /**
     * Listen a message type
     */
    MessageChannelContent.listen = function (type, processor) {
        MessageChannelContent.processors[type] = processor;
    };
    /**
     * Listener entry
     */
    MessageChannelContent.runtimeEntry = function (message, _sender, sendResponse) {
        // Search for the processor
        var processor = MessageChannelContent.processors[message.type];
        if (processor !== undefined) {
            // processor(message, (res: any) => {
            //     sendResponse(res);
            // });
            processor(message, sendResponse);
            return true;
        }
        // fallback
        sendResponse(null);
        return false;
    };
    // static global = globalThis;
    MessageChannelContent.browser = globalThis.chrome;
    MessageChannelContent.processors = {};
    (function () {
        MessageChannelContent.browser.runtime.onMessage.addListener(MessageChannelContent.runtimeEntry);
    })();
    return MessageChannelContent;
}());

export { MessageChannelContent as default };
