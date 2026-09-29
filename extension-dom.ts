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
    static async sendMessageToContent<R>(message: Message, queryOptions = { active: true, currentWindow: true }): Promise<R> {
        const tabs: Array<{id: number, url: string}> = await MessageChannelExtensionDom.browser.tabs.query(queryOptions);
        // Filter out extension pages
        const filteredTabs = tabs.filter((tab) => {
            return tab.url.startsWith('http://') || tab.url.startsWith('https://');
        });
        if(filteredTabs.length === 0) {
            throw new Error('No valid tabs found');
        }

        const response = await MessageChannelExtensionDom.browser.tabs.sendMessage(filteredTabs[0].id, message);
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
