import type { Message } from './types';

/**
 * MessageChannelExtensionDom
 */
export default class MessageChannelExtensionDom {
    static browser = (globalThis as any).chrome;

    /**
     * Send message to content.js
     *
     * ```
     * MessageChannelExtensionDom.sendMessageToContent();
     * ```
     */
    static async sendMessageToContent<R>(message: Message): Promise<R> {
        const queryOptions = { active: true, currentWindow: true };
        const tabs = await MessageChannelExtensionDom.browser.tabs.query(queryOptions);
        const response = await MessageChannelExtensionDom.browser.tabs.sendMessage(tabs[0].id, message);
        return response;
    }

    /**
     * Send message to service.js
     */
    static async sendMessageToService<R>(message: Message): Promise<R> {
        const response = await MessageChannelExtensionDom.browser.runtime.sendMessage(message);
        return response;
    }
}
