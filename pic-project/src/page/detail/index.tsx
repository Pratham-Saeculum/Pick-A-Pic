import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/png/Brand-logo.png";
import { Tooltip } from "antd";

const Detail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const image = location.state;


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


const handleDownload = async () => {
  try {
    const response = await fetch(image.src.large2x, {
      mode: 'cors',
    });

    if (!response.ok) throw new Error('Fetch failed');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `pexels-${image.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  } catch (e) {
    // Fallback: open in new tab (user can save manually)
    window.open(image.src.large2x, "_blank");
  }
};

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* HEADER */}
      <div className="bg-[#001529] border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* 🔙 BACK BUTTON (LEFT SIDE NOW) */}
          <Tooltip title="Back to Images" placement="top">
            <button
              onClick={() => navigate("/")}
              className="bg-[#0e2e77] hover:bg-[#031b52] text-white px-4 py-2 rounded-lg transition cursor-pointer"
            >
              Back
            </button>
          </Tooltip>

          {/* LOGO (RIGHT SIDE NOW) */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} className="w-20 h-20 object-cover" />
            <h1 className="text-white font-semibold italic text-2xl">
              PickaPic
            </h1>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-2">
        <div className="bg-[#1e293b] rounded-2xl shadow-lg p-6">
          {/* IMAGE */}
          <div className="flex justify-center items-center">
            <img
              src={image.src.large2x} // ✅ Pexels field
              alt={image.alt}
              className="max-h-[70vh] w-auto object-contain rounded-xl"
            />
          </div>

          {/* INFO */}
          <div className="mt-6 flex flex-row justify-between items-end">
            {/* LEFT - all info */}
            <div className="flex flex-col gap-2">
              <p className="font-medium text-white">
                <span className="font-bold">Dimensions</span> : {image.width} ×{" "}
                {image.height}
              </p>
              <p className="text-sm text-gray-400">
                <span className="font-bold">Photographer</span> :{" "}
                {image.photographer}
              </p>
              <p className="text-sm text-gray-400">
                <span className="font-bold">Description</span> : {image.alt}
              </p>
            </div>

            {/* RIGHT - download button */}
            <Tooltip title="Download Image" placement="top">
              <button
                onClick={handleDownload}
                className="bg-[#0e2e77] hover:bg-[#031b52] text-white px-5 py-2 rounded-lg font-medium transition cursor-pointer"
              >
                Download
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
