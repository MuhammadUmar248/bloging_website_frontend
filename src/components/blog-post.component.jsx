import { getDay } from "../common/date";
import { Link } from "react-router-dom";

const BlogPostCard = ({ content, author }) => {
  let {
    publishedAt,
    banner,
    tags,
    des,
    title,
    activity: { total_likes },
    blog_id: id,
  } = content;
  let { fullname, profile_img, username } = author;
  return (
    <Link
      to={`/blog/${id}`}
      className=" flex gap-8 items-center border-b border-grey pb-5 mb-4"
    >
      <div className=" w-full">
        <div className=" flex gap-2 item-center mb-7">
          <img src={profile_img} className=" w-6 h-6 rounded-full" />
          <b className=" line-clamp-1">
            {fullname} @{username}
          </b>
          <p className="min-w-fit"> {getDay(publishedAt)} </p>
        </div>
        <h3 className=" bolg-title">{title}</h3>
        <p className=" my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2:">
          {des}
        </p>
        <div className=" flex gap-4 mt-7">
          <span className=" btn-light py-1 px-4 bg-gre hover:bg-lg border-grey">{tags[0]}</span>
        </div>
      </div>

      <div className=" h-28 aspect-square bg-gre">
        <img
          src={banner}
          className=" w-full h-full aspect-square object-cover"
        />
      </div>
    </Link>
  );
};

export default BlogPostCard;
