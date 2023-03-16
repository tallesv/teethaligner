import { v4 } from 'uuid';
import { app } from '../config/firebase';

export default async function uploadFile(file: File): Promise<string> {
  const uuid = v4();
  const findDot = file.name.indexOf('.');
  const firstPart = file.name.slice(0, findDot);
  const secondPart = file.name.slice(findDot);
  const fileName = `${firstPart}-${uuid}${secondPart}`;

  const storageRef = app.storage().ref();
  const fileRef = storageRef.child(fileName);
  await fileRef.put(file);
  const fileUrl = await fileRef.getDownloadURL();

  return fileUrl;
}
