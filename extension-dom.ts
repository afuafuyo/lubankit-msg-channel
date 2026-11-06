import type { Message } from './types';

/**
 * MessageChannelExtensionDom
 */
export default class MessageChannelExtensionDom {
    static browser = (globalThis as any).chrome;

    static async queryTabs(queryOptions = { active: true, currentWindow: true }): Promise<Array<{id: number, url: string}>> {
        const tabs: Array<{id: number, url: string}> = await MessageChannelExtensionDom.browser.tabs.query(queryOptions);
        // Filter out extension pages
        const filteredTabs = tabs.filter((tab) => {
            return tab.url.startsWith('http://') || tab.url.startsWith('https://');
        });

        return filteredTabs;
    }

    /**
     * Send message to all content scripts in the current window
     */
    static async sendMessageToAllContent(message: Message, queryOptions = { active: true, currentWindow: true }): Promise<void> {
        const filteredTabs = await MessageChannelExtensionDom.queryTabs(queryOptions);
        if(filteredTabs.length === 0) {
            throw new Error('No valid tabs found');
        }

        await Promise.all(filteredTabs.map(
            tab => MessageChannelExtensionDom.browser.tabs.sendMessage(tab.id, message)
        ));
    }

    /**
     * Send message to content script
     */
    static async sendMessageToContent<R>(message: Message, queryOptions = { active: true, currentWindow: true }): Promise<R | null> {
        const filteredTabs = await MessageChannelExtensionDom.queryTabs(queryOptions);
        if(filteredTabs.length === 0) {
            throw new Error('No valid tabs found');
        }

        const response = await MessageChannelExtensionDom.browser.tabs.sendMessage(filteredTabs[0].id, message);
        return response;
    }

    /**
     * Send message to service script
     */
    static async sendMessageToService<R>(message: Message): Promise<R | null> {
        const response = await MessageChannelExtensionDom.browser.runtime.sendMessage(message);
        return response;
    }
}
