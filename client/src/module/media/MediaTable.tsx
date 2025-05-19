"use client";

import { useEffect, useState } from "react";
import { deleteMedia, getAllMedia } from "@/service/media";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Media } from "@/type/type";
import { toast } from "sonner";
import ConfirmDeleteModal from "@/components/MODAL/ConfirmDeleteModal";
import { UpdateModalForm } from "./update-part/UpdateModalForm";

const MediaTable = () => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
const [modalOpen, setModalOpen] = useState(false);
const [editModalOpen, setEditModalOpen] = useState(false);
const [selectedMediaForEdit, setSelectedMediaForEdit] = useState<Media | null>(null);
  const fetchMedia = async () => {
    try {
      const result = await getAllMedia();
      setMediaList(result?.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch media");
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

const handleEdit = (id: string) => {
  const media = mediaList.find(m => m.id === id);
  if (media) {
    setSelectedMediaForEdit(media);
    setEditModalOpen(true);
  }
};

const handleUpdate = (updatedMedia: { type: "MOVIE" | "SERIES"; title: string; description: string; genre: string; videoUrls: string[]; amount: number; thumbnail?: File; id: string; }) => {
  setMediaList(prev =>
    prev.map(m => (m.id === updatedMedia.id ? { ...m, ...updatedMedia } : m))
  );
  setEditModalOpen(false);
  setSelectedMediaForEdit(null);
  toast.success("Media updated successfully");
};


  const handleDeleteClick = (id: string) => {
    setSelectedMediaId(id);
    setModalOpen(true);
  };

const handleConfirmDelete = async () => {
  if (!selectedMediaId) return;

  try {
    await deleteMedia(selectedMediaId);
    setMediaList((prev) => prev.filter((media) => media.id !== selectedMediaId));
    setModalOpen(false);
    setSelectedMediaId(null);
    setTimeout(() => {
      toast.success("Media deleted successfully");
    }, 300);
  } catch (error: any) {
    // 👉 Check if it's a Prisma P2003 constraint error
    if (error.message?.includes("Foreign key constraint") || error.message?.includes("P2003")) {
      toast.error("Unable to delete media", {
        description: "This media is linked with a payment record.",
      });
    } else {
      toast.error("Failed to delete media", {
        description: error?.message || "Something went wrong.",
      });
    }
  }
};

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Media</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Release Year</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mediaList.map((media) => (
            <TableRow key={media.id}>
              <TableCell>
                <img
                  src={media.thumbnail}
                  alt={media.title}
                  className="w-16 h-16 object-cover rounded"
                />
              </TableCell>
              <TableCell>{media.title}</TableCell>
              <TableCell>{media.genre}</TableCell>
              <TableCell>{media.releaseDate}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(media.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(media.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Do you really want to delete this ${mediaList.find(m => m.id === selectedMediaId)?.title ?? 'media'}?`}
      />

       <UpdateModalForm
      open={editModalOpen}
      onClose={() => setEditModalOpen(false)}
      media={selectedMediaForEdit}
      onSave={handleUpdate}
    />
   </div>
  );
};

export default MediaTable;
