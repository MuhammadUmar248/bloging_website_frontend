import axios from "axios";
import { createContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import AnimationWraper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogContent from "../components/blog-content.component";

const blogStructure = {
  title: "",
  banner: "",
  conent: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
  publishedAt: "",
};

export const BlogContext = createContext({});

const BlogPage = () => {
  let { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(true);

  let {
    title,
    banner,
    content,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;

  const fetchBlog = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {
        blog_id,
      })
      .then(({ data: { blog } }) => {
        setBlog(blog);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlog();
  }, []);
  return (
    <AnimationWraper>
      {loading ? (
        <Loader />
      ) : (
        <div className=" max-[900px] center py-10 max-lg:px-[10vw] px-12">
          <img
            src={banner}
            className=" aspect-video rounded-md border-2 border-lg "
          />

          <div className=" mt-12">
            <h2>{title}</h2>
            <div className=" flex max-sm:flex-col justify-between my-8">
              <div className=" flex gap-5 items-start">
                <img src={profile_img} className=" w-12 h-12 rounded-full" />

                <p className=" capitalize">
                  {fullname}
                  <br />
                  <Link to={`/user/${author_username}`} className=" underline">
                    <b>@{author_username}</b>
                  </Link>
                </p>
              </div>

              <p className=" text-black opacity-60 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                Published on {getDay(publishedAt)}
              </p>
            </div>
          </div>
          <div className=" my-12 font-gelasio blog-page-content">
            {content[0].blocks.map((block, i) => {
              return (
                <div key={i} className=" my-4 md:my-8">
                  <BlogContent block={block} />
                </div>
              );
            })}
          </div>

          <div>
            <b> Description: </b>
            <p className=" w-full text-center my-3 md:mb-12  text-black font-gelasio font-medium text-xl">
              {blog.des}
            </p>
          </div>
          <div>
            <b> Tags: </b>
            {blog.tags.map((tag, i) => {
              return (
                <div key={i}>
                  <li className=" text-2xl p-3  px-6 ">{tag}</li>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AnimationWraper>
  );
};

export default BlogPage;
