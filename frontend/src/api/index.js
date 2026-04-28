import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 30000,
});

export const getTemplates = () => api.get("/templates");
export const getTemplate = (name) => api.get(`/templates/${name}`);

export const previewTemplate = (name, data) =>
  api.post("/preview", { name, data });

export const downloadPdf = async (name, data) => {
  const res = await api.post(
    "/generate/pdf",
    { name, data },
    { responseType: "blob" }
  );
  const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};

export const downloadDocx = async (name, data) => {
  const res = await api.post(
    "/generate/docx",
    { name, data },
    { responseType: "blob" }
  );
  const url = URL.createObjectURL(
    new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.docx`;
  a.click();
  URL.revokeObjectURL(url);
};

export default api;
