"use client";

import { useUser } from "@/context/userContext";
import Payment from "@/module/payment/Payment";
import { getAllMedia } from "@/service/media";
import { useEffect, useState } from "react";

const CartPage = () => {
  const { user } = useUser();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllMedia();
        console.log("API Response:", response);
        if (response?.data?.data?.length > 0) {
          const media = response.data.data;
          console.log("Media", media);
          console.log("media ID from pay:", media.id);
          setContent(media);
        } else {
          console.log("No media found in response");
        }
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    fetchData();
  }, []);

  if (!user || !content) {
    console.log("User or Content not available:", { user, content });
    return <div>Loading...</div>;
  }

  console.log("Rendered Content:", content);

  return (
    <div className="w-1/2 mx-auto mt-10">
      <Payment content={content} user={user} />
    </div>
  );
};

export default CartPage;