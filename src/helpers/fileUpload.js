export const fileUpload =  async (file) => {

    //if(!file) throw new Error('file error');

    if(!file) return null;

    const cloudUrl = 'https://api.cloudinary.com/v1_1/dl60invb7/image/upload';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'react-journal');

    try {

        const resp = await fetch(cloudUrl, {
            method: 'POST',
            body: formData
        });

        if(!resp.ok) {
            throw new Error("couldn't upload image");
        }

        const cloudResp = await resp.json();

        
        return cloudResp.secure_url;
    } catch(error){
        throw new Error( error.message );
    }
};