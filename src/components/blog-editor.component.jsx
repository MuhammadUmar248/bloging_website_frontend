import { Link, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWraper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { imageDb } from "../common/firebase";
import { v4 } from "uuid";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import axios from "axios";
import { UserContext } from "../App";

const BlogEditor = () => {
  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let Navigate = useNavigate();

  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holderId: "textEditor",
          data: content,
          tools: tools,
          placeholder: "Let's Write an awesome story  ",
        })
      );
    }
  }, []);

  const [imgUrl, setImgUrl] = useState("");

  const handlBannerUpload = (e) => {
    let img = e.target.files[0];
    if (img) {
      let Loading = toast.loading("Uploding...");
      const imgref = ref(imageDb, `/bannerImages/${v4()}`);
      uploadBytes(imgref, img)
        .then(() => {
          return getDownloadURL(imgref);
        })
        .then((downloadURL) => {
          console.log("Image URL is: ", downloadURL);
          setImgUrl(downloadURL);
          toast.dismiss(Loading);
          toast.success("Uploaded 👍🏻");

          setBlog({ ...blog, banner: downloadURL });
        })
        .catch((err) => {
          console.log("erroe is here", err);
          toast.dismiss(Loading);
          return toast.error(err);
        });
    }
    // console.log("img",img)
    // if (img) {
    //     setImgUrl(img)
    // }
    // setImgUrl(img)
    //     console.log("imge Url is here")
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog({ ...blog, title: input.value });
  };

  const handlError = (e) => {
    let img = e.target;
    img.src = defaultBanner;
  };

  const handlPublishEvent = () => {
    if (!banner.length) {
      return toast.error("Upload a blog banner to publish it");
    }

    if (!title.length) {
      return toast.error("Write a blog title to publish it");
    }

    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("Publish");
          } else {
            return toast.error("Write something in your blog to publish it");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSaveDraft = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }

    if (!title.length) {
      return toast.error("Write blog title before Saving it as a draft");
    }

    let loadingToast = toast.loading("Saving Draft....");

    e.target.classList.add("disable");
    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        let blogObj = {
          title,
          banner,
          tags,
          des,
          content,
          draft: true,
        };
        axios
          .post("http://localhost:3001" + "/create-blog", blogObj, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          })
          .then(() => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
            toast.success("Saved 👍🏻");

            setTimeout(() => {
              Navigate("/");
            }, 500);
          })
          .catch(({ response }) => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);

            return toast.error(response.data.error);
          });
      });
    }
  };
  // useEffect(() => {
  //     listAll(ref(imageDb,"bannerImages")).then(imgs => {
  //         console.log(imgs)
  //         imgs.items.forEach(val => {
  //             getDownloadURL(val).then(url => {
  //                 setImgUrl([url])
  //                 console.log("Setimage is here", setImgUrl)
  //             })
  //         })
  //     })
  // },[])

  // console.log("image is here", imgUrl)
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-12">
          <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2 " onClick={handlPublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2 " onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>
      <Toaster />
      <AnimationWraper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video bg-white border-4 border-black hover:opacity-80">
              <label htmlFor="uploadBanner">
                {imgUrl == "" ? (
                  <img src={banner} className="z-20" onError={handlError} />
                ) : (
                  <img src={imgUrl} className="z-20" />
                )}
                {/* <img
                src={defaultBanner}
                
                // className="z-20"
                />
                {
                    imgUrl.map(dataVal => {
                        console.log("Dta valis here", dataVal);
                        <div>
                            <img src={dataVal} className="h-200 w-200"/>
                        </div>
                    })
                } */}
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handlBannerUpload}
                />
              </label>
            </div>
            <textarea
              defaultValue={title}
              placeholder="Bolg Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40   "
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>
            <hr className="w-full opacity-10 my-5" />
            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWraper>
    </>
  );
};

export default BlogEditor;
