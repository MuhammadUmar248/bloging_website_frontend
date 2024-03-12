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
import LoadMoreDataBtn from "../components/load-more.component";

const HomePage = () => {
  let [blogs, setBlogs] = useState(null);
  let [treningBlogs, setTreningBlogs] = useState(null);
  let [pageState, setPageState] = useState("Home");

  let categories = [
    "programing",
    "hollywood",
    "film making",
    "social media",
    "cooking",
    "tech",
    "finance",
    "travel",
  ];

  const fetchlatestBlog = (page = 1) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
      .then(async ({ data }) => {
        let formatData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          counteRoute: "/all-latest-blogs-count",
        });
        setBlogs(formatData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetcBlogByCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blog", { tag: pageState, page })
      .then(async ({ data }) => {
        let formatData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          counteRoute: "/search-blog-count",
          data_to_send: { tag: pageState },
        });
        setBlogs(formatData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchTrendingBlog = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTreningBlogs(data.blogs);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadBlogBCategory = (e) => {
    let category = e.target.innerText.toLowerCase();
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
      fetchlatestBlog({ page: 1 });
    } else {
      fetcBlogByCategory({ page: 1 });
    }
    if (!treningBlogs) {
      fetchTrendingBlog();
    }
  }, [pageState]);

  return (
    <AnimationWraper>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <InPageNavigation
            routes={[pageState.toUpperCase(), "Trending Blogs"]}
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
              <LoadMoreDataBtn
                state={blogs}
                fetchDataFun={
                  pageState == "Home" ? fetchlatestBlog : fetcBlogByCategory
                }
              />
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
                      className={`tag ${
                        pageState == categery ? " bg-grey text-black " : " "
                      }`}
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
                      transition={{ duration: 1, delay: i * 0.5 }}
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
