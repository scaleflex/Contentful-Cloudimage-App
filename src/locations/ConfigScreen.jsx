import { setup } from '@contentful/dam-app-base';

const ConfigScreen = () => {
  setup({
    cta: 'Select assets',
    name: 'Scaleflex Cloudimage',
    logo: 'https://store.filerobot.com/techdocs/header-logo/0822f6dc25bb7dd0e942602e1aae1b9c0ee61d7f29df17abbb207fce82e05350.png',
    color: '#d7f0fa',
    description: 'Scaleflex Cloudimage',
    parameterDefinitions: [
      {
        "id": "token",
        "type": "Symbol",
        "name": "Token",
        "description": "Token",
        "required": true
      },
      {
        "id": "lazy_loading",
        "type": "List",
        "name": "Use lazy-loading?",
        "description": "Use Cloudimage lazy-loading or not. https://github.com/scaleflex/js-cloudimage-responsive#lazyloading",
        "required": true,
        "value": 'true,false'
      },
      {
        "id": "version",
        "type": "List",
        "name": "Is version 7?",
        "description": "FALSE for tokens created after 01.10.2021. TRUE for tokens created before.",
        "required": true,
        "value": 'true,false',
        "default": 'false'
      }
    ],
    validateParameters: () => null,
    makeThumbnail: asset => asset.thumbnailUrl,
    openDialog: async (sdk, currentValue, config) => {
      return await sdk.dialogs.openCurrentApp({
        parameters: { config, currentValue },
      });
    },
    isDisabled: () => false
  });
};
export default ConfigScreen;