/**
 * Service Script
 */
var MessageChannelService = /** @class */ (function () {
    function MessageChannelService() {
    }
    /**
     * Listen a message type
     */
    MessageChannelService.listen = function (type, processor) {
        MessageChannelService.processors[type] = processor;
    };
    /**
     * Listener entry
     */
    MessageChannelService.runtimeEntry = function (message, _sender, sendResponse) {
        // Search for the processor
        var processor = MessageChannelService.processors[message.type];
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
    // static global: any = globalThis;
    MessageChannelService.browser = globalThis.chrome;
    MessageChannelService.processors = {};
    (function () {
        MessageChannelService.browser.runtime.onMessage.addListener(MessageChannelService.runtimeEntry);
    })();
    return MessageChannelService;
}());

export { MessageChannelService as default };
