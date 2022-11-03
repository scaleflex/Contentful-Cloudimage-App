import React from 'react';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import Img, { CloudimageProvider } from 'react-cloudimage-responsive';
import './Field.css';

const Field = () => {
  const sdk = useSDK();
  useAutoResizer();
  const configs = sdk.parameters.installation;

  const cloudimageConfig = {
    token: configs.token,
    lazyLoading: true
  };

  const updateImages = function(event) 
  {
    var images = event.target.files;

    if (images && images.length) 
    {
      for (let i = 0; i < images.length; i++)
      {
        console.dir(images[i]);

        // let existingMedia = sdk.entry.fields.cloudimage.getValue(); 
        // existingMedia = existingMedia ? existingMedia : {}; 
        // delete existingMedia[closeBtn.id]; 
        // sdk.entry.fields.cloudimage.setValue(existingMedia);

        // NEED TO LEARN TO programatically upload image: https://contentful-community.slack.com/archives/C2FEW8QRY/p1667412778099329

        // window.location.reload();
      }
    }
  }

  const displayExistingImages = function() 
  {
    let existings = sdk.entry.fields.cloudimage.getValue();
    existings = existings ? existings : {};
    existings = { // Temp for dev
      'aaa':'https://demo.cloudimg.io/v7/https://cdn.scaleflex.it/demo/cloudimage-responsive-demo/Girl+img.jpg',
      'bbb':'https://demo.cloudimg.io/v7/https://cdn.scaleflex.it/demo/cloudimage-responsive-demo/Girl+img.jpg'
    };
    let gallery = [];

    for (const [key, value] of Object.entries(existings)) 
    {
      gallery.push(
        <div key={key} className="tile">
          <Img src={value} />
          <span className="close"></span>
        </div>
      );
    }

    return gallery;
  }

  return (
    <div className="container">
      <input type="file" multiple accept="image/*" onChange={updateImages} />
      <CloudimageProvider config={cloudimageConfig}>
        {displayExistingImages()}
      </CloudimageProvider>
    </div>
  )
};

export default Field;
