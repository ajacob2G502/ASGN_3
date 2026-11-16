import { Link } from "react-router-dom";
import { handleImageError } from "../assets/imageFallback";

const AlbumCard = ({ album, onAddToCart }) => {
  if (!album) return null;
  const soldOut = album.stock <= 0;

  return (
    <article className="product-card">
      <Link className="product-img-link" to={`/album/${album.id}`}>
        <img
          className="product-image"
          src={album.image}
          alt={`${album.title} cover`}
          loading="lazy"
          onError={handleImageError}
        />
      </Link>
      <div className="product-body">
        <span className="product-category">{album.genre}</span>
        <h3 className="product-title">
          <Link to={`/album/${album.id}`}>{album.title}</Link>
        </h3>
        <p className="product-artist">{album.artist}</p>
        <p className="product-price">${album.price.toFixed(2)}</p>
        <button
          className="btn btn-secondary btn-block"
          type="button"
          disabled={soldOut}
          onClick={() => onAddToCart(album)}
        >
          {soldOut ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default AlbumCard;
