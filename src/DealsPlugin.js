import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';
import DealsList from './components/DealsList/DealsList';

const PLUGIN_NAME = 'DealsPlugin';

export default class DealsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   */
  async init(flex, manager) {
    flex.Actions.addListener('afterSelectTask', (payload) => {
      const customerID = payload.task.attributes.customerID;
      if (customerID) {
        const options = { sortOrder: -1 };
        flex.CRMContainer.Content.replace(
          <DealsList key="deals-list" customerID={customerID} />,
          { options }
        );
      }
    });

    flex.Actions.addListener('afterClearTask', () => {
      flex.CRMContainer.Content.restore();
    });
  }
}
