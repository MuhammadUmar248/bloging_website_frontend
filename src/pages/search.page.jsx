import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import AnimationWraper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import NotDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";
import UserCard from "../components/usercard.component";

const SearchPage = () => {
  let { query } = useParams();
  let [blogs, setBlogs] = useState(null);
  let [users, setUsers] = useState(null);

  const searchBlogs = ({ page = 1, create_new_arr = false }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blog", { query, page })
      .then(async ({ data }) => {
        let formatData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          counteRoute: "/search-blog-count",
          data_to_send: { query },
          create_new_arr,
        });
        setBlogs(formatData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const fetchUsers = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
      .then(({ data }) => {
        setUsers(data.users); // Changed from users.user to data.users
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query]);

  const resetState = () => {
    setBlogs(null);
    setUsers(null);
  };

  const UserCardWrapper = () => {
    return (
      <>
        {users == null ? (
          <Loader />
        ) : users.length ? (
          users.map((user, i) => {
            return (
              <AnimationWraper
                key={i}
                transition={{ duration: 1, delay: i * 0.0 }}
              >
                <UserCard user={user} />
              </AnimationWraper>
            );
          })
        ) : (
          <NotDataMessage message="No User Found" />
        )}
      </>
    );
  };

  return (
    <section className=" h-cover flex justify-center gap-10">
      <div className=" w-full">
        <InPageNavigation
          routes={[`Search Result From "${query}" `, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
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
            <LoadMoreDataBtn state={blogs} fetchDataFun={searchBlogs} />
          </>
          <UserCardWrapper />
        </InPageNavigation>
      </div>

      <div className=" min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
        <h1 className=" font-medium text-xl mb-8">
          {" "}
          User Related To Search{" "}
          <i className="fi fi-rr-user mt-1 ml-2 text-xl"></i>{" "}
        </h1>
        <UserCardWrapper />
      </div>
    </section>
  );
};

export default SearchPage;
