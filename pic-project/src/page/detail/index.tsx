import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../assets/png/Brand-logo.png";

const Detail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const image = location.state;

  const [fileSize, setFileSize] = useState("");

  if (!image) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          ← Back
        </button>
      </div>
    );
  }

  // 🔥 File size
  useEffect(() => {
    const getFileSize = async () => {
      try {
        const response = await fetch(image.largeImageURL);
        const blob = await response.blob();

        const sizeKB = blob.size / 1024;
        const sizeMB = sizeKB / 1024;

        setFileSize(
          sizeMB >= 1
            ? sizeMB.toFixed(2) + " MB"
            : sizeKB.toFixed(2) + " KB"
        );
      } catch (e) {
        console.error("Size error");
      }
    };

    getFileSize();
  }, [image]);

  // 🔥 Download
  const handleDownload = async () => {
    const res = await fetch(image.largeImageURL);
    const blob = await res.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${image.id}.jpg`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* HEADER */}
      <div className="bg-[#001529] border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6  flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} className="w-20 h-20 object-cover" />
            <h1 className="text-white font-semibold italic text-2xl">
              PickaPic
            </h1>
          </div>

          <button
            onClick={() => navigate("/")}
            className="bg-[#0e2e77] hover:bg-[#031b52] text-white px-4 py-2 rounded-lg transition cursor-pointer"
          >
          Back
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-2">
        <div className="bg-[#1e293b] rounded-2xl shadow-lg p-6">

          {/* IMAGE */}
          <div className="flex justify-center items-center">
            <img
              src={image.largeImageURL}
              alt={image.tags}
              className="max-h-[70vh] w-auto object-contain rounded-xl"
            />
          </div>

          {/* INFO */}
          <div className="mt-6 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            
            {/* LEFT INFO */}
            <div className="flex flex-col gap-2 text-gray-300">
              <p className="font-medium text-white">
                   <span className="font-bold">Image Size</span> : {fileSize || "Loading size..."}
               
              </p>

              <p className="text-sm">
        <span className="font-bold">Dimensions</span> : {image.imageWidth} × {image.imageHeight}
              </p>

              <p className="text-sm text-gray-400">
                <span className="font-bold">Image Description</span> : {image.tags}
              </p>
            </div>

            {/* DOWNLOAD */}
            <button
              onClick={handleDownload}
              className="bg-[#0e2e77] hover:bg-[#031b52] text-white px-5 py-2 rounded-lg font-medium transition cursor-pointer"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;