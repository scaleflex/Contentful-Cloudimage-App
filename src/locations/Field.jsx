import React, { useState, useEffect } from 'react';
import { Paragraph, TextInput } from '@contentful/f36-components';
import { useSDK, useCMA, useAutoResizer } from '@contentful/react-apps-toolkit';
import Img, { CloudimageProvider } from 'react-cloudimage-responsive';
import './Field.css';

const Field = () => {
  const sdk = useSDK();
  const cma = useCMA();

  const [isPublished, setIsPublished] = useState( !!sdk.entry.getSys().publishedVersion );
  const [isProcessing, setIsProcessing] = useState(false);
  const configs = sdk.parameters.installation;
  useAutoResizer();

  useEffect(() => {
    function sysChangeHandler(value) 
    {
      setIsPublished( !!sdk.entry.getSys().publishedVersion );
    }
    sdk.entry.onSysChanged(sysChangeHandler);
  }, [sdk]);
  const ciConfig = {
    token: configs.token,
    lazyLoading: JSON.parse( configs.lazy_loading ),
    apiVersion: JSON.parse( configs.version ) ? null : 'v7'
  };

  const updateImages = async function(event) 
  {
    setIsProcessing(true);

    let images = event.target.files;

    let existings = sdk.entry.fields.cloudimage.getValue(); 
    existings = existings ? existings : {}; 

    if (images && images.length) 
    {
      for (let i = 0; i < images.length; i++)
      {
        let data = await new Promise((resolve, reject) => {
          var reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(images[i]);
        });

        let asset = await cma.asset.createFromFiles(
          {},
          {
            fields: {
              title: { [sdk.locales.default]: images[i].name },
              description: { [sdk.locales.default]: '' },
              file: {
                [sdk.locales.default]: {
                  file: data,
                  fileName: images[i].name,
                  contentType: images[i].type,
                },
              },
            },
          }
        );

        asset = await cma.asset.processForAllLocales({}, asset);
        asset = await cma.asset.publish({ assetId: asset.sys.id }, asset);

        let url = asset.fields.file[sdk.locales.default].url;
        let uniqueId = `${Math.floor(Math.random() * 1000000000000000)}${Date.now()}`;
        existings[uniqueId] = url;
        sdk.entry.fields.cloudimage.setValue(existings);
      }
    }

    setIsProcessing(false);
    window.location.reload();
  }

  const removeTile = function(e) 
  {
    setIsProcessing(true);

    let tileId = e.target.parentNode.id;
    let existings = sdk.entry.fields.cloudimage.getValue();
    existings = existings ? existings : {};
    delete existings[tileId];
    sdk.entry.fields.cloudimage.setValue(existings);

    // e.target.parentElement.remove(); // No need for this actually

    setIsProcessing(false);
    window.location.reload();
  }

  const displayExistingImages = function() 
  {
    let existings = sdk.entry.fields.cloudimage.getValue();
    existings = existings ? existings : {};
    let gallery = [];

    for (const [key, value] of Object.entries(existings)) 
    {
      gallery.push(
        <div key={key} id={key} className="tile">
          <Img src={value} />
          {!isPublished && <span className="close" onClick={removeTile}></span>}
        </div>
      );
    }

    return gallery;
  }

  if (!configs.token)
  {
    return <Paragraph>Please set Cloudimage token.</Paragraph>;
  }

  return (
    <div className="container">
      {!isPublished && <TextInput type="file" multiple accept="image/*" size="small" onChange={updateImages} />}
      {isProcessing && <Paragraph>Processing ...</Paragraph>}
      <CloudimageProvider config={ciConfig}>
        {displayExistingImages()}
      </CloudimageProvider>
    </div>
  )
};

export default Field;
