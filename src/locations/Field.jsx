import React, { useState, useEffect } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import Img, { CloudimageProvider } from 'react-cloudimage-responsive';
import './Field.css';

const Field = () => {
  const sdk = useSDK();
  const isPublished = !!sdk.entry.getSys().publishedVersion;
  const [isProcessing, setIsProcessing] = useState(false);
  const configs = sdk.parameters.installation;
  useAutoResizer();


  // // CHECK VERSION
  // let headers = new Headers();
  // headers.append("x-hexa-missingbehavior", "default_200");
  // let options = {
  //   method: 'GET',
  //   headers: headers
  // };
  // let response = await fetch(`https://${configs.token}.cloudimg.io/v7/http://sample.li/blank.png`, options);
  // // v7 if response.status === 200 && !response.headers.get('x-hexa-missingbehavior')


  const ciConfig = {
    token: configs.token,
    lazyLoading: true,
    apiVersion: null
  };

  const updateImages = function(event) 
  {
    let images = event.target.files;

    if (images && images.length) 
    {
      for (let i = 0; i < images.length; i++)
      {
        // Encode the file using the FileReader API
        const reader = new FileReader();
        reader.onloadend = async () => {
          setIsProcessing(true);

          // Use a regex to remove data url part
          let base64String = reader.result
            .replace('data:', '')
            .replace(/^.+,/, '');

          let upload = await sdk.space.createUpload(base64String);
          let asset = await sdk.space.createAsset(upload)
          asset = await sdk.space.getAsset(/*asset.sys.id*/ '5y4YUss6XwdBwyfkMX4qeO'); // Temp for dev
          let url = asset.fields.file[sdk.locales.default].url;

          let existings = sdk.entry.fields.cloudimage.getValue(); 
          existings = existings ? existings : {}; 
          let uniqueId = `${Math.floor(Math.random() * 1000000000000000)}${Date.now()}`;
          existings[uniqueId] = url;
          console.dir(url);
          sdk.entry.fields.cloudimage.setValue(existings);

          setIsProcessing(false);
          window.location.reload();
        };
        reader.readAsDataURL(images[i]);
      }
    }
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
    // existings = { // Temp for dev
    //   'aaa':'https://images.ctfassets.net/80fs6s6xy4li/5y4YUss6XwdBwyfkMX4qeO/78f9bf5c7d9cd54fd345d34d806b650a/bay.jpg',
    //   'bbb':'https://cdn.scaleflex.it/demo/cloudimage-responsive-demo/Girl+img.jpg'
    // };
    console.dir(existings);
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
      {!isPublished && <input type="file" multiple accept="image/*" onChange={updateImages} />}
      {isProcessing && <Paragraph>Processing ...</Paragraph>}
      <CloudimageProvider config={ciConfig}>
        {displayExistingImages()}
      </CloudimageProvider>
    </div>
  )
};

export default Field;
