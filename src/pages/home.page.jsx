import { useEffect, useState } from "react";
import AnimationWraper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { activeTabRef } from "../components/inpage-navigation.component";
import NotDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";

const HomePage = () => {
  let [blogs, setBlogs] = useState(null);
  let [treningBlogs, setTreningBlogs] = useState(null);
  let [pageState, setPageState] = useState("Home");

  let categories = [
    "Programing",
    "Hollywood",
    "Film Making",
    "Social Media",
    "Cooking",
    "Tech",
    "Finance",
    "Travel",
  ];

  const fetchlatestBlog = (page = 1) => {
    axios
      .post("http://localhost:3001" + "/latest-blogs", { page })
      .then( async({ data }) => {

        console.log("Data Blog", data.blogs);

        let formatData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute:"/all-latest-blogs-count"
        })
        setBlogs(formatData);
        console.log("formated Data", formatData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetcBlogByCategory = () => {
    axios
      .post("http://localhost:3001" + "/search-blog", { tag: pageState })
      .then(({ data }) => {
        setBlogs(data.blogs);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchTrendingBlog = () => {
    axios
      .get("http://localhost:3001" + "/trending-blogs")
      .then(({ data }) => {
        setTreningBlogs(data.blogs);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadBlogBCategory = (e) => {
    let category = e.target.innerText;
    console.log("sate here", category);
    setBlogs(null);
    if (pageState == category) {
      setPageState("Home");
      return;
    }
    setPageState(category);
  };

  useEffect(() => {
    activeTabRef.current.click();
    if (pageState == "Home") {
      fetchlatestBlog();
    } else {
      fetcBlogByCategory();
    }
    if (!treningBlogs) {
      fetchTrendingBlog();
    }
  }, [pageState]);

  // console.log("trending blog", treningBlogs)

  return (
    <AnimationWraper>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "Trending Blogs"]}
            defaultHidden={["Trending Blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : blogs.results.length ? (
                blogs.results.map((blog, i) => {
                  return (
                    <AnimationWraper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWraper>
                  );
                })
              ) : (
                <NotDataMessage message="No Blog Published" />
              )}
            </>
            {treningBlogs == null ? (
              <Loader />
            ) : treningBlogs.length ? (
              treningBlogs.map((blog, i) => {
                return (
                  <AnimationWraper
                    transition={{ duration: 1, delay: i * 1 }}
                    key={i}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWraper>
                );
              })
            ) : (
              <NotDataMessage message="No Trending Blogs" />
            )}
          </InPageNavigation>
        </div>

        <div className=" min-w-[40%] lg:min-w-min border-1 bordder-grey pl-8 pt-3 max-md:hidden">
          <div className=" flex flex-col gap-10">
            <div>
              <h1 className=" font-medium text-xl mb-8">
                Storise from all interests
              </h1>

              <div className=" flex gap-3 flex-wrap">
                {categories.map((categery, i) => {
                  return (
                    <button
                      onClick={loadBlogBCategory}
                      className={
                        "tag" +
                        (pageState == categery ? " bg-black text-white" : "")
                      }
                      key={i}
                    >
                      {categery}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <h1 className=" font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              {treningBlogs == null ? (
                <Loader />
              ) : treningBlogs.length ? (
                treningBlogs.map((blog, i) => {
                  return (
                    <AnimationWraper
                      transition={{ duration: 1, delay: i * 1 }}
                      key={i}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWraper>
                  );
                })
              ) : (
                <NotDataMessage message="No Trending Blogs" />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWraper>
  );
};

export default HomePage;
