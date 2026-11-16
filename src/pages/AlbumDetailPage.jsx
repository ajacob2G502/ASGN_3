import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { handleImageError } from "../assets/imageFallback";

const AlbumDetailPage = ({ albums, onAddToCart }) => {
  const { albumId } = useParams();
  const [qty, setQty] = useState(1);

  const album = albums.find((a) => a.id === albumId);

  if (!album) {
    return (
      <div className="detail-error">
        <h2>Album Not Found</h2>
        <Link className="btn btn-secondary" to="/">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const soldOut = album.stock <= 0;

  return (
    <div className="detail-container">
      <nav className="breadcrumb">
        <Link to="/">Catalog</Link> &gt; <span>{album.title}</span>
      </nav>

      <div className="detail-grid">
        <img
          src={album.image}
          alt={`${album.title} cover`}
          className="detail-img"
          onError={handleImageError}
        />

        <div className="detail-info">
          <span className="product-category">{album.genre}</span>
          <h1 className="detail-title">{album.title}</h1>
          <p className="detail-artist">{album.artist}</p>
          <p className="detail-price">${album.price.toFixed(2)}</p>
          <p className="detail-desc">{album.description}</p>

          <dl className="spec-list">
            <div>
              <dt>Pressing weight</dt>
              <dd>{album.specs.weight}</dd>
            </div>
            <div>
              <dt>Catalog number</dt>
              <dd>{album.specs.catalogNumber}</dd>
            </div>
            <div>
              <dt>Speed</dt>
              <dd>{album.specs.speed}</dd>
            </div>
            <div>
              <dt>Label</dt>
              <dd>{album.specs.label}</dd>
            </div>
          </dl>

          <h3 className="tracklist-heading">Tracklist</h3>
          <ol className="tracklist">
            {album.tracklist.map((track) => (
              <li key={track}>{track}</li>
            ))}
          </ol>

          <div className={`stock-tag ${soldOut ? "out" : ""}`}>
            {soldOut
              ? "Out of Stock"
              : `✔️ In Stock (${album.stock} available)`}
          </div>

          {!soldOut && (
            <div className="detail-action">
              <div className="qty-input-group">
                <label htmlFor="detail-qty">Quantity: </label>
                <input
                  type="number"
                  id="detail-qty"
                  min="1"
                  max={album.stock}
                  value={qty}
                  onChange={(e) =>
                    setQty(
                      Math.min(
                        album.stock,
                        Math.max(1, parseInt(e.target.value, 10) || 1),
                      ),
                    )
                  }
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onAddToCart(album, qty)}
              >
                Add {qty} to cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumDetailPage;
