import { getDay } from "../common/date";
import { Link } from "react-router-dom";


const MinimalBlogPost = ({ blog, index }) => {
  let {
    title,
    bolg_id: id,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    publishedAt,
  } = blog;

  return (
    <div className="flex gap-5 mb-8">
      <h1 className=" blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>
      <div>
        <div className=" flex gap-2 item-center mb-7">
          <img src={profile_img} className=" w-6 h-6 rounded-full" />
          {fullname}
          <Link to={`/user/${username}`} className=" underline">
                    <b>  @{username}</b>
                  </Link>

          <p className="min-w-fit"> {getDay(publishedAt)} </p>
        </div>
        <h1 className=" blog-title">{title}</h1>
      </div>
    </div>
  );
};
export default MinimalBlogPost;
