import { getStorage, ref, deleteObject } from 'firebase/storage';

export default async function deleteFile(url: string) {
  const storage = getStorage();

  // Create a reference to the file to delete
  const desertRef = ref(storage, url);

  // Delete the file
  deleteObject(desertRef);
}
