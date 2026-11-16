import { useState } from "react";
import AlbumCard from "../components/AlbumCard";

const GENRES = ["All", "Jazz", "Electronic", "Rock", "Classical"];

const CatalogPage = ({ albums, onAddToCart }) => {
  const [selectedGenre, setSelectedGenre] = useState("All");

  const validAlbums = albums || [];
  const filteredAlbums =
    selectedGenre === "All"
      ? validAlbums
      : validAlbums.filter((a) => a.genre === selectedGenre);

  return (
    <div className="catalog-container">
      <header className="catalog-hero">
        <h1>Indie Records, Pressed on Vinyl</h1>
        <p>Independent releases across jazz, electronic, rock and classical.</p>
      </header>

      <div className="filter-bar">
        {GENRES.map((genre) => (
          <button
            key={genre}
            type="button"
            className={`filter-pill ${selectedGenre === genre ? "active" : ""}`}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filteredAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} onAddToCart={onAddToCart} />
        ))}
      </div>
      {filteredAlbums.length === 0 && (
        <p className="empty-note">No albums in this genre yet.</p>
      )}
    </div>
  );
};

export default CatalogPage;
