import { useState, useRef } from "react";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const CropperImage = ({previewImage, croppedImage}) => {
    // console.log('previewImage-->', previewImage);
    const cropperRef = useRef(null);
    const [image, setImage] = useState("");

    const base64ToBlob = (base64String, contentType) => {
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
      };

    const onCrop = () => {
        const cropper = cropperRef.current?.cropper;
        const imageUrl = cropper.getCroppedCanvas().toDataURL();
        console.log('00', imageUrl);
        setImage(imageUrl)
      };

      const cropImage = (e) => {
        e.preventDefault();
        const base64String = image.split(',')[1];
        const blob = base64ToBlob(base64String, 'image/jpeg'); // Adjust the MIME type accordingly
        const fileName = 'image.jpg'; // You can set any desired file name
        const convertedFile = new File([blob], fileName, { type: blob.type });
        // Now you have the converted File object, you can use it as needed.
        console.log(convertedFile, '---');
        croppedImage(convertedFile)
    };

    return (
        <>
        <Cropper
            src={previewImage}
            style={{ height: 300, width: '100%' }}
            aspectRatio={16 / 9} // Set your desired aspect ratio
            guides={true}
            crop={onCrop}
            ref={cropperRef}
        />
        <button className="crop-btn" onClick={cropImage}>Crop Image</button>
        </>
    )
}

export default CropperImage;