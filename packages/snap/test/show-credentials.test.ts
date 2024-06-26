import { expect } from '@jest/globals';
import { installSnap } from '@metamask/snaps-jest';
import { NodeType, panel, text } from '@metamask/snaps-sdk';
import { ListAccountsResponse } from 'src/handlers';

describe('onRpcRequest', () => {
  describe('show-credentials', () => {
    it('should show credentials', async () => {
      const { request } = await installSnap();
      const origin = 'Jest';
      const accountList: ListAccountsResponse = ((await request({
        method: 'account.list',
        origin
      })) as any).response.result;

      const response = request({
        method: 'account.showCredentials',
        origin,
        params: {
          address: accountList[0]!.address,
        },
      });

      const confirmationUi = await response.getInterface();
      expect(confirmationUi.type).toBe('confirmation');
      expect(confirmationUi).toRender(
        panel([
          text('**Are you sure you want to display your credentials?**'),
          text(
            `Make sure no one else sees them, and don't show them in crowded or public places !`,
          ),
        ]),
      );
      await confirmationUi.ok();

      const ui = await response.getInterface();
      expect(ui.type).toBe('alert');
      expect(ui.content).toMatchObject({
        type: NodeType.Panel,
        children: [
          {
            type: NodeType.Text,
            value: '**Account Credentials:**',
          },
          {
            type: NodeType.Text,
            value: `Address: ${accountList[0]!.address}`,
          },
          {
            type: NodeType.Text,
            value: expect.stringContaining('Public Key:'),
          },
          {
            type: NodeType.Text,
            value: expect.stringContaining('Secret Key:'),
          }
        ],
      });

      await ui.ok();
    });

    it('should not show credentials for not imported account', async () => {
      const { request } = await installSnap();
      const origin = 'Jest';

      const response = request({
        method: 'account.showCredentials',
        origin,
        params: {
          address: 'AU199wi4sBM2DyBeje88WQveDdTWGCs461VocsHpbT7FWiPyfqxD',
        },
      });

      expect(await response).toRespondWithError({
        code: expect.any(Number),
        message:
          'Account not found: AU199wi4sBM2DyBeje88WQveDdTWGCs461VocsHpbT7FWiPyfqxD',
        stack: expect.any(String),
      });
    });
  });
});
