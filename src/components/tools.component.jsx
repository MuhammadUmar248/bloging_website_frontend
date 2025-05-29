import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InLineCode from "@editorjs/inline-code";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDb } from "../common/firebase";
import { v4 } from "uuid";

const uploadImageByFile = (e) => {
  const imgref = ref(imageDb, `/blogImages/${v4()}`);
  uploadBytes(imgref, e)
    .then(() => {
      return getDownloadURL(imgref);
    })
    .then((URL) => {
      if (URL) {
        return {
          success: 1,
          file: { URL },
        };
      }
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
      return {
        success: 0,
        error: "Failed to upload image.",
      };
    });
};

const uploadImageByUrl = (e) => {
  let link = new promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (err) {
      reject(err);
    }
  });
  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Enter a Heading",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InLineCode,
};
