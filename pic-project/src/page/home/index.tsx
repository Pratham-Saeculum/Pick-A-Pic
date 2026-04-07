import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/png/Brand-logo.png";

const Home = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const [activeCategory, setActiveCategory] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");

  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_PEXELS_API_KEY;

  const categories = [
    "Nature",
    "Travel",
    "Food",
    "Animals",
    "Technology",
    "People",
    "Sports",
    "India",
    "Space",
    "Cartoon",
    "Cars",
  ];

  const skeletonArray = Array.from({ length: 20 });

  const fetchImages = async (searchQuery?: string, pageNum = 1) => {
    try {
      setLoading(true);

      const url = searchQuery
        ? `https://api.pexels.com/v1/search?query=${searchQuery}&page=${pageNum}&per_page=${perPage}`
        : `https://api.pexels.com/v1/curated?page=${pageNum}&per_page=${perPage}`;

      const res = await fetch(url, {
        headers: {
          Authorization: apiKey, 
        },
      });
      const data = await res.json();

      setImages(data.photos || []);
      setTotalPages(Math.ceil((data.total_results || 0) / perPage));
    } catch (error) {
      console.error(error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages("", 1);
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;

    setPage(1);
    setActiveCategory("");
    setCurrentSearch(query);
    fetchImages(query, 1);
  };
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setPage(1);
    setCurrentSearch(category);
    fetchImages(category, 1);
  };

  const handleNext = () => {
    const next = page + 1;
    setPage(next);
    fetchImages(currentSearch, next);
  };

  const handlePrev = () => {
    if (page === 1) return;
    const prev = page - 1;
    setPage(prev);
    fetchImages(currentSearch, prev);
  };
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* HEADER */}
      <div className="bg-[#001529] border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-1 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} className="w-16 h-16 object-cover" />
            <h1 className="text-white font-semibold text-2xl italic">
              PickaPic
            </h1>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center bg-[#0f172a] border border-white rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search images..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="flex-1 bg-transparent text-white px-4 py-2 outline-none placeholder-gray-400"
              />
              <button
                onClick={handleSearch}
                disabled={!query.trim()}
                className="bg-white px-5 py-2 text-black font-medium transition cursor-pointer disabled:opacity-50"
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="bg-[#001529] border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-3 flex gap-3 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`cursor-pointer px-4 py-1 rounded-full whitespace-nowrap transition ${
                  activeCategory === cat
                    ? "bg-blue-500 text-white"
                    : "bg-[#0e2e77] text-white hover:bg-blue-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-6 min-h-[60vh]">
        {/* GRID + FALLBACK */}
        {!loading && images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <div className="text-6xl mb-4">🔍</div>

            <h2 className="text-white text-xl font-semibold mb-2">
              No images found
            </h2>

            <p className="text-gray-400 mb-4">
              Try searching something else or explore categories
            </p>

            <button
              onClick={() => {
                setQuery("");
                fetchImages("", 1);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition"
            >
              Explore Images
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loading
              ? skeletonArray.map((_, i) => (
                  <div
                    key={i}
                    className="h-48 bg-[#1e293b] rounded-xl animate-pulse"
                  />
                ))
              : images.map((img) => (
                  <div
                    key={img.id}
                    onClick={() =>
                      navigate(`/details/${img.id}`, { state: img })
                    }
                    className="bg-white rounded-xl overflow-hidden shadow hover:scale-105 transition cursor-pointer"
                  >
                    <img
                      src={img.src.medium} 
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://placehold.co/400x300/1e293b/white?text=Image+Unavailable";
                      }}
                    />
                  </div>
                ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-4 py-2 rounded bg-gray-300 disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>

          <span className="text-white">
            Page {page} of {totalPages || 1}
          </span>

          <button
            onClick={handleNext}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
