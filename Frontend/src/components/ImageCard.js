import React from "react";
import { Rating } from "react-simple-star-rating";
import { RATING_SONG } from "../components/API";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function rateSong(SongId, rating) {
  if (localStorage.getItem("deltaxusertoken")) {
    return fetch(RATING_SONG(SongId), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("deltaxusertoken")}`,
      },
      body: JSON.stringify({
        rating,
      }),
    });
  }
}

const ImageCard = ({ image, isRating, setIsRating }) => {
  const [value, setValue] = React.useState(0);

  // Catch Rating value
  const handleRating = (rate) => {
    setValue(rate);
  };

  const rateSongAPI = async (url) => {
    try {
      const response = await rateSong(url, value / 20);
      const { status, message } = await response.json();
      if (status) {
        setIsRating(!isRating);
        toast.success("Song Rated Succesfully!", { autoClose: 2000 });
      } else {
        toast.success(message, { autoClose: 2000 });
      }
    } catch (e) {}
  };
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg hover:-translate-y-0.5 hover:shadow duration-200">
      <img src={image?.coverUrl} alt="" className="w-full h-40" />
      <div className="px-6 py-4">
        <div className="flex">
          <div className="h-4 w-6 bg-blue-600 rounded mb-2">
            <p className="text-xs text-white text-center">
              {image?.totalRating === null ? 0 : image?.totalRating}
            </p>
          </div>
          <p className="text-xs ml-2">
            {image?.totalRatingUser === null ? 0 : image?.totalRatingUser}{" "}
            Reviews
          </p>
        </div>
        <div className="text-sm font-semibold text-heading md:text-base">
          {image?.songName}
        </div>
        <div className=" cursor-pointer truncate text-xs text-body md:text-sm">
          {image?.ArtistName}
        </div>
        <div className=" cursor-pointer truncate text-xs text-body md:text-sm mt-1">
          {image?.releaseDate}
        </div>
        <div className="flex mb-4">
          <p className="mr-5 mt-1">rate us </p>
          <Rating
            onClick={handleRating}
            ratingValue={value}
            size={20}
            label
            transition
            fillColor="orange"
            emptyColor="gray"
          />
        </div>
        {value !== 0 && (
          <button onClick={() => rateSongAPI(image?.ID)}>Submit </button>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
