"use server";


import { revalidateTag } from "next/cache";

import { cookies } from "next/headers";

// Create Media
export const createMedia = async (formData: FormData) => {
  console.log(process.env.NEXT_PUBLIC_BASE_API, formData)
 const accessToken = (await cookies()).get("accessToken")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/media/upload-media`, {
    method: "POST",
    headers: {
      Authorization : accessToken as string
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Something went wrong");
  }

  return res.json(); // বা তোমার backend যা রিটার্ন করে
};

// Get All Media
export const getAllMedia = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/media/get-all-media`, {
      next: { tags: ["MEDIA"] },
    });
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// Get Single Media by ID
export const getMediaById = async (mediaId: string) => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/media/${mediaId}`, {
      headers: {
        Authorization: accessToken as string
      },
      next: { tags: ["MEDIA"] },
    });
    // console.log('api',`${process.env.NEXT_PUBLIC_BASE_API}/media/${mediaId}`)
    
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// Update Media
export const updateMedia = async (mediaId: string, data: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/media/${mediaId}`, {
      method: "PATCH",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
      body: data,
    });
    revalidateTag("MEDIA");
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// Delete Media
export const deleteMedia = async (mediaId: string) => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  if (!accessToken) {
    throw new Error("Authorization token is required");
  }
  console.log("Deleting mediaId:", mediaId);
  console.log("Using token:", accessToken);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/media/delete-media/${mediaId}`, {
    method: "DELETE",
    headers: {
      Authorization: accessToken,
    },
  });

  console.log("Response status:", res.status);
  if (!res.ok) {
    const error = await res.text();
    console.error("Delete failed:", error);
    throw new Error(error || "Delete failed");
  }
  return res.json();
};

