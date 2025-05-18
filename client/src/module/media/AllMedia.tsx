"use client";

import { useEffect, useState } from "react";
import { Media } from "@/type/type";
import { getAllMedia } from "@/service/media";
import MediaCard from "./MediaCard";

const AllMedia = ()=> {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await getAllMedia();
        // টাইপ চেকিং করে সঠিকভাবে অ্যারে পাওয়া গেলে সেট করতে হবে
        if (Array.isArray(response?.data?.data) && response.data.data.length > 0) {
          setMediaList(response.data.data);
        }
      } catch (error) {
        // console.error("Error fetching media:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mt-6">
      {mediaList.map((media: Media) => (
        <MediaCard key={media.id} media={media} />
      ))}
    </div>
  );
};

export default AllMedia;
