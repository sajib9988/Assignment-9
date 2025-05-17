"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IMedia } from "../media/media";

const MediaDetails = ({
  media,
  hasPurchased,
}: {
  media: IMedia;
  hasPurchased: boolean;
}) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-white p-4 rounded-md my-5 shadow-sm">
      {/* Media Poster */}
      <div>
        <Image
          src={media?.thumbnail || "/placeholder.jpg"}
          alt="media poster"
          width={500}
          height={500}
          className="rounded-md w-full object-cover h-80"
        />

   
      </div>

      {/* Media Information */}
      <div className="bg-white rounded-md p-4">
        <h2 className="font-bold text-xl mb-4">{media?.title}</h2>
        <p className="text-justify text-gray-500 font-light text-sm mb-3">
          {media?.description}
        </p>

        <div className="flex flex-wrap gap-3 text-gray-500 text-xs mb-5">
          
          <p className="rounded-full px-4 py-1 bg-gray-100">
            Genre: {media?.genre}
          </p>
   
          <p className="rounded-full px-4 py-1 bg-gray-100">
            Release: {media?.releaseDate?.toLocaleDateString()}
          </p>
          <p className="rounded-full px-4 py-1 bg-gray-100">
            Type: {media?.type}
          </p>
        </div>

        <hr />

        {/* Pricing */}
        <p className="my-2 font-bold">
          Price: {media?.amount}
        </p>

        <hr />

        {/* Action Buttons */}
        {hasPurchased ? (
          <Button
            className="w-full my-5"
            onClick={() => router.push(`/watch/${media.id}`)}
          >
            Watch Now
          </Button>
        ) : (
          <>
            
            <Button
              className="w-full"
              onClick={() => router.push(`/checkout/${media.id}`)}
            >
              Buy / Rent Now
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaDetails;
