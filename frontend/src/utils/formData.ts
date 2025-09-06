export const fromDataConstructor = (blob: Blob, convId: string): FormData => {
  const fileName = `recording-${Date.now()}.webm`;
  const formData = new FormData();
  formData.append("audio", blob, fileName);
  formData.append("conversationId", convId);
  return formData;
};
