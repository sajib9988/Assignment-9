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
      const response = await getAllMedia();
      if (response?.data?.data?.length > 0) {
        setContent(response.data.data[0]); // একটাই Media দিচ্ছি
      }
    };

    fetchData();
  }, []);

  if (!user || !content) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <Payment content={content} user={user} />
    </div>
  );
};

export default CartPage;
