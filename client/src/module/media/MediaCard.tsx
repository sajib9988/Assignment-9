"use client";

import { Button } from "@/components/ui/button";
import { Media } from "@/type/type";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const MediaCard = ({ media }: { media: Media }) => {
  const router = useRouter();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/checkout/${media.id}`);
  };

  return (
    <Link href={`/media/${media.id}`}>
      <motion.div
        className="p-3 rounded-lg border bg-amber-100 shadow-md m-2"
        whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-64 w-full rounded-md overflow-hidden">
          <Image
            src={
              typeof media.thumbnail === "string"
                ? media.thumbnail
                : media.thumbnail
                ? URL.createObjectURL(media.thumbnail)
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={media.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="mt-3">
          <h3 className="font-semibold text-lg text-black line-clamp-1" title={media.title}>
            {media.title}
          </h3>

          <p className="text-sm text-gray-600">
            Release Year: {new Date(media.releaseDate).getFullYear()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Type: {media.type}</p>

          <div className="mt-3">
            <Button onClick={handleBuyNow} className="w-full">
              Buy Now
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default MediaCard;
