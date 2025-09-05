export const fromDataConstructor = (blob: Blob, convID: string): FormData => {
  const fileName = `recording-${Date.now()}.webm`;
  const formData = new FormData();
  formData.append("audioFile", blob, fileName);
  formData.append("conversationID", convID);
  return formData;
};
