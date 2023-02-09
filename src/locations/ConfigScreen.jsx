import { setup } from '@contentful/dam-app-base';

const ConfigScreen = () => {
  setup({
    cta: 'Select assets',
    name: 'Cloudimage from Scaleflex',
    logo: 'https://store.filerobot.com/techdocs/header-logo/0822f6dc25bb7dd0e942602e1aae1b9c0ee61d7f29df17abbb207fce82e05350.png',
    color: '#d7f0fa',
    description: 'Cloudimage will resize, compress and optimise your Wordpress images before delivering responsive images lightning fast over Content Delivery Networks all around the World. Simply add your Cloudimage token below and the plugin will do the magic automatically.',
    parameterDefinitions: [
      {
        "id": "token",
        "type": "Symbol",
        "name": "Cloudimage token or custom domain",
        "description": "Cloudimage token to link your account and be able to process optimizations according to your settings. Can be found in your Cloudimage admin panel. (CNAME)",
        "required": true
      },
      {
        "id": "version",
        "type": "List",
        "name": "Version-less URL format (remove \"v7\" in URL for recent tokens)",
        "description": "Switch ON for tokens created after 01.10.2021. OFF for tokens created before. This option will be automatically switched at save, as relevant. You will be asked to confirm the setup in case the automated setting process fails (eg. network issue at the time of test).",
        "required": true,
        "value": 'true,false',
        "default": 'true'
      },
      {
        "id": "lazy_loading",
        "type": "List",
        "name": "Use lazy-loading?",
        "description": "Use Cloudimage lazy-loading or not. https://github.com/scaleflex/js-cloudimage-responsive#lazyloading",
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