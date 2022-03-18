import { AiOutlineHeart } from "react-icons/ai";
export default function RecipeCard(props) {
  return (
    <div className="w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col">
      <a href={props.post.post_url}>
        <img
          className="object-cover md:h-64 md:w-100 hover:grow hover:shadow-lg w-full h-auto"
          src={props.post.post_img_url_src}
          alt="product"
        />
        <div className="pt-3 flex items-center justify-between">
          <p className="">{props.post.post_title}</p>
          <AiOutlineHeart size={25}/>
        </div>
        <p className="text-sm mt-4 text-gray-600">
          {props.post.post_description}
        </p>
        <p className="w-full mt-3 py-2 text-red-900 font-bold rounded-xl border-red-900 px-4 border-2 hover:border-red-700 hover:text-red-700">
          <center>
            <a href={props.post.post_url}>View Recipe</a>
          </center>
        </p>
      </a>
    </div>
  );
}
