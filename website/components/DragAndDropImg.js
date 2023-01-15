import { useEffect } from "react";
import { useState, useRef } from "react";

const DragAndDropImage = ({ image, setImage }) => {
  const [dragActive, setDragActive] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    setImage(files[0]);
  };

  // handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  useEffect(() => {
    if (image) {
      setDisplayText(image.name);
    } else {
      setDisplayText("");
    }
  }, [image]);

  return (
    <form
      id="form-file-upload"
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        ref={inputRef}
        type="file"
        id="input-file-upload"
        multiple={true}
        onChange={handleChange}
      />
      <label
        id="label-file-upload"
        htmlFor="input-file-upload"
        className={dragActive ? "drag-active" : ""}
      >
        <div className="p4">
          {displayText ? <p className="w-[90%] mx-auto">{displayText}</p> :
          <p>Drag & drop sliku u naznačeni prostor</p>}
          <button className="upload-button" onClick={onButtonClick}>
            Odaberi sliku
          </button>
        </div>
      </label>
      {dragActive && (
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </form>
  );
};

export default DragAndDropImage;
