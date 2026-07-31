import type { Message, Processor } from './types';

/**
 * Service Script
 */
export default class MessageChannelService {
    // static global: any = globalThis;
    static browser: any = (globalThis as any).chrome;
    private static processors: Record<string, Processor<any, any>> = {};

    static {
        MessageChannelService.browser.runtime.onMessage.addListener(MessageChannelService.runtimeEntry);
    }

    /**
     * Listen a message type
     */
    static listen(type: string, processor: Processor): void {
        MessageChannelService.processors[type] = processor;
    }

    /**
     * Listener entry
     */
    private static runtimeEntry(message: Message, _sender: any, sendResponse: any): boolean {
        // Search for the processor
        const processor = MessageChannelService.processors[message.type];
        if(processor !== undefined) {
            // processor(message, (res: any) => {
            //     sendResponse(res);
            // });
            processor(message, sendResponse);
            return true;
        }

        // fallback
        sendResponse(null);
        return false;
    }
}
