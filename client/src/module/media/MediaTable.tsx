"use client";

import { useEffect, useState } from "react";
import { deleteMedia, getAllMedia, updateMedia } from "@/service/media";
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

// আলাদা টাইপ ডিফিনিশন
type MediaForUpdate = {
  id: string;
  title: string;
  description: string;
  genre: string;
  type: "MOVIE" | "SERIES";
  videoUrls: string[];
  amount: number;
  thumbnail?: File | string;
  releaseDate?: string;
};

const MediaTable = () => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMediaForEdit, setSelectedMediaForEdit] = useState<MediaForUpdate | null>(null);

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
      setSelectedMediaForEdit({
        ...media,
        type: media.type === "MOVIE" || media.type === "SERIES"
          ? media.type
          : "MOVIE",
        thumbnail: typeof media.thumbnail === 'string'
          ? media.thumbnail
          : media.thumbnail instanceof File
            ? URL.createObjectURL(media.thumbnail)
            : '',
      });
      setEditModalOpen(true);
    }
  };

  const handleUpdate = async (updatedMedia: MediaForUpdate) => {
    try {
      const formData = new FormData();
      const body = {
        title: updatedMedia.title,
        description: updatedMedia.description,
        genre: updatedMedia.genre,
        type: updatedMedia.type,
        amount: updatedMedia.amount,
        videoUrls: updatedMedia.videoUrls,
        releaseDate: updatedMedia.releaseDate
      };

      formData.append("data", JSON.stringify(body));

      if (updatedMedia.thumbnail instanceof File) {
        formData.append("thumbnail", updatedMedia.thumbnail);
      }

      await updateMedia(updatedMedia.id, formData);

      setMediaList(prev => prev.map(m => 
        m.id === updatedMedia.id ? { 
          ...m, 
          ...body,
          thumbnail: updatedMedia.thumbnail instanceof File
            ? URL.createObjectURL(updatedMedia.thumbnail)
            : typeof updatedMedia.thumbnail === 'string'
              ? updatedMedia.thumbnail
              : m.thumbnail,
          releaseDate: updatedMedia.releaseDate ?? m.releaseDate ?? ""
        } as Media : m
      ));

      setEditModalOpen(false);
      toast.success("Media updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update media");
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedMediaId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMediaId) return;
    try {
      await deleteMedia(selectedMediaId);
      setMediaList(prev => prev.filter(media => media.id !== selectedMediaId));
      setModalOpen(false);
      setSelectedMediaId(null);
      toast.success("Media deleted successfully");
    } catch (error: any) {
      if (error.message?.includes("Foreign key constraint") || error.message?.includes("P2003")) {
        toast.error("Cannot delete media", {
          description: "This media is associated with existing payments.",
        });
      } else {
        toast.error("Failed to delete media", {
          description: error?.message || "Something went wrong.",
        });
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[100px]">Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mediaList.length > 0 ? (
              mediaList.map((media) => (
                <TableRow key={media.id}>
                  <TableCell>
                    <img 
                      src={media.thumbnail} 
                      alt={media.title} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{media.title}</TableCell>
                  <TableCell>{media.type}</TableCell>
                  <TableCell>{media.genre}</TableCell>
                  <TableCell>{media.releaseDate || '-'}</TableCell>
                  <TableCell>${media.amount}</TableCell>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No media found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Media Modal */}
      {selectedMediaForEdit && (
        <UpdateModalForm 
          open={editModalOpen} 
          onClose={() => setEditModalOpen(false)} 
          media={selectedMediaForEdit} 
          onSave={handleUpdate} 
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={handleConfirmDelete} 
        title={`Delete "${mediaList.find(m => m.id === selectedMediaId)?.title || 'this media'}"?`}
      />
    </div>
  );
};

export default MediaTable;