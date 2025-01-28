/**
 * Replacing the vanilla message with wxt message.
 * {@link https://webext-core.aklinker1.io/messaging/installation}
 *   
 */
import { defineExtensionMessaging } from "@webext-core/messaging";

export default defineUnlistedScript(() => { })

interface ProtocolMap {
	getStringLength(data: string): number
	getSidePanelState(isOpen: boolean ): boolean
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();