import { fileUpload } from "../../helpers/fileUpload";
import 'core-js';

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: 'dl60invb7',
    api_key: '519568839481416',
    api_secret: 'SPb4GNBokrDwnt3WZQbQ_eG_Xn0',
    secure: true,
});

describe('fileUpload tests', () => {
    test('must upload file correctly to cloudinary', async () => {
        const imgUrl = 'https://sportshub.cbsistatic.com/i/2022/12/18/f22c5052-509f-4fe9-a1b2-a2bcd4c89d25/hells-paradise-jigokuraku.png';

        const resp = await fetch( imgUrl );
        const blob = await resp.blob();
        const file = new File([blob], "hell's paradise");

        const url = await fileUpload ( file );

        const segments = url.split('/');

        const imageId = segments[segments.length -1 ].replace('.png', '');



        expect(typeof url).toBe('string');

       const cloudResp = await cloudinary.api.delete_resources([ 'journal/' + imageId ], {
        resource_type: 'image'
       });

    });

    test('must return null', async () => {
        const file = null;
        
        const url = await fileUpload(file);

        expect(url).toBe(null);
    });


});