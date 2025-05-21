"use server";


import { MediaParams } from "@/type/type";
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



export const getAllMedia = async (params?: MediaParams) => {
  try {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
      if (params.genre) queryParams.append('genre', params.genre);
      if (params.title) queryParams.append('title', params.title);
      if (params.type) queryParams.append('type', params.type);
      if (params.releaseDate) queryParams.append('releaseDate', params.releaseDate);

      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    }

    const url = `${process.env.NEXT_PUBLIC_BASE_API}/media/get-all-media?${queryParams.toString()}`;

    const res = await fetch(url, {
      next: { tags: ['MEDIA'] },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch media');
    }

    const data = await res.json();
    return data; // এখানে meta এবং data থাকবে, যেমন backend থেকে আসবে
  } catch (error) {
    console.error('Error fetching media:', error);
    throw error;
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/media/update-media/${mediaId}`, {
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

