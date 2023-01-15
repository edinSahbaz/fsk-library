import { useEffect } from "react";
import DragAndDropImage from "./DragAndDropImg";

const ImageModal = ({setShowImgModal, setImage, image}) => {
    useEffect(() => {
        return () => {
            setImage(null);
        }
    }, [])

    return ( 
    <div className="shadow" onClick={() => setShowImgModal(false)}>
        <div className="imageModal" onClick={e => e.stopPropagation()}>
            <DragAndDropImage setImage={setImage} image={image}/>
        </div>
    </div> );
}
 
export default ImageModal;