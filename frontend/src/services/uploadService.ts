import api from './api';

export interface UploadResult {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export const uploadService = {
  async uploadFile(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post<UploadResult>('/upload', formData);
    return res.data;
  },
};
