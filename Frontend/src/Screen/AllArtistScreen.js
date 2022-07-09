import React, { useState, useEffect } from "react";
import { FETCH_ARTIST_API } from "../components/API";
import "react-toastify/dist/ReactToastify.css";

function getAllArtist() {
  if (localStorage.getItem("deltaxusertoken")) {
    return fetch(FETCH_ARTIST_API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("deltaxusertoken")}`,
      },
    });
  }
}

const AllArtistScreen = () => {
  const [artistdata, setArtist] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsSubmitting(true);
    async function fetchData() {
      try {
        const response = await getAllArtist();
        const { status, artistDetail } = await response.json();

        if (status) {
          setArtist(artistDetail);
          setIsSubmitting(false);
        } else if (status === false) {
          setIsSubmitting(false);
        } else {
          setIsSubmitting(false);
        }
      } catch (e) {
        setIsSubmitting(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="w-3/4 mr-auto ml-auto mt-10">
      <table class="min-w-full">
        <thead class="bg-white border-b">
          <tr>
            <th
              scope="col"
              class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
            >
              Artist
            </th>
            <th
              scope="col"
              class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
            >
              Date of Birth
            </th>
            <th
              scope="col"
              class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
            >
              Bio
            </th>
            <th
              scope="col"
              class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
            >
              Songs
            </th>
          </tr>
        </thead>
        <tbody>
          {artistdata?.map((item, index) => (
            <tr class="bg-gray-100 border-b" key={index}>
              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {item?.ArtistName}
              </td>
              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {item?.Dob}
              </td>
              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {item?.Bio}
              </td>
              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {item?.songName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllArtistScreen;
