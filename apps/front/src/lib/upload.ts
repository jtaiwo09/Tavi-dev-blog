// import { createClient } from "@supabase/supabase-js";

// export async function uploadThumbnail(image: File) {
//   const supabaseUrl = process.env.SUPABASE_URL!;
//   const supabaseKey = process.env.SUPABASE_API_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const data = await supabase.storage
//     .from("thumbnails")
//     .upload(`${image.name}_${Date.now()}`, image);

//   console.log({ data });

//   if (!data.data?.path) throw new Error("failed to upload the file");
//   const urlData = await supabase.storage
//     .from("thumbnails")
//     .getPublicUrl(data.data?.path);

//   return urlData.data.publicUrl;
// }

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type UploadOptions = {
  folder: string;
};

export async function uploadImage(image: File, { folder }: UploadOptions) {
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });

  return result;
}

export async function uploadThumbnail(image: File) {
  const result = await uploadImage(image, {
    folder: "blog/thumbnails",
  });

  return result.secure_url;
}

export async function uploadAvatar(image: File) {
  const result = await uploadImage(image, {
    folder: "blog/avatars",
  });

  return result.secure_url;
}
