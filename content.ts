import type { Callback, Message, Processor } from './types';

/**
 * Content Script
 */
export default class MessageChannelContent {
    // static global = globalThis;
    static browser: any = (globalThis as any).chrome;
    private static processors: Record<string, Processor<any, any>> = {};

    static {
        MessageChannelContent.browser.runtime.onMessage.addListener(MessageChannelContent.runtimeEntry);
    }

    /**
     * Listen a message type
     */
    static listen(type: string, processor: Processor): void {
        MessageChannelContent.processors[type] = processor;
    }

    /**
     * Listener entry
     */
    private static runtimeEntry(message: Message, _sender: any, sendResponse: Callback): boolean {
        // Search for the processor
        const processor = MessageChannelContent.processors[message.type];
        if(processor !== undefined) {
            processor(message, sendResponse);
            // Keep the message channel open for asynchronous response
            return true;
        }

        // fallback
        sendResponse(null);
        return false;
    }
}
