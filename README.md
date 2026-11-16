# VinylVault: Indie Record Online Store

A React single-page storefront for browsing vinyl records by genre, viewing album details, managing a slide-over cart, and checking out with a controlled form. Built with React and Vite, with client-side routing from `react-router-dom`.

---

## 1. Project Setup & Execution Instructions

### Prerequisites

- **Node.js v21 or newer** (a current LTS release such as v22 is recommended). Check with `node -v`.
- **npm** (installed with Node.js). Check with `npm -v`.
- **Git**, to clone the repository.
- A modern web browser (Chrome, Firefox, Edge, or Safari).
- An internet connection, because album cover images load from Unsplash.

### Installation

1. Clone the repository:

```bash
git clone <YOUR-REPOSITORY-URL>
```

2. Move into the project folder:

```bash
cd <YOUR-REPOSITORY-FOLDER>
```

3. Install dependencies. This also installs `react-router-dom`, which is already listed in `package.json`:

```bash
npm install
```

### Running the development server

1. Start the server:

```bash
npm run dev
```

2. The terminal prints a local address, usually `http://localhost:5173/`. Open it in your browser.
3. Verify the app is running:
   - The VinylVault catalog loads with eight albums and the genre filter buttons.
   - Clicking an album opens its detail page at `/album/<id>` without a page reload.
   - The "Cart" button in the header opens the slide-over cart.
     Other scripts: `npm run build` creates a production build, `npm run preview` serves that build, and `npm run lint` runs ESLint.

### Directory structure overview

The root folder holds the configuration files (`index.html`, `vite.config.js`, `package.json`) and this README. All application code lives in `src/`, where `main.jsx` mounts the app and `App.jsx` owns the shared cart state. Inside `src/`, `components/` holds reusable UI pieces, `pages/` holds the three routed views, `data/` holds the `albums.js` dataset, and `assets/` holds the image fallback files. Global styling is in `src/styles.css`.

---

## 2. React Component Hierarchy & State Flow Architecture

### Legend

- **State** lists `useState` variables as `name [type]: purpose`.
- **Props** lists the props a component receives, with types.
- **Callbacks** lists functions passed across component boundaries or defined to handle events.
- **Route** marks components rendered by React Router.

### Component tree

```
<BrowserRouter>                       -> src/main.jsx
 └─ <App />                           -> src/App.jsx
    │  State (owner of all shared state):
    │    cart [Array of album objects, each with a quantity field]: items in the cart
    │    isCartOpen [Boolean]: whether the slide-over cart drawer is visible
    │  Callbacks defined here (passed down as props):
    │    handleAddToCart(album, quantity)   adds an album or increases its quantity (capped at stock)
    │    handleUpdateQuantity(albumId, delta)   changes a quantity by +1 or -1, removes it at 0
    │    handleRemoveFromCart(albumId)   removes a line item
    │    handleClearCart()   empties the cart after checkout
    │  Derived value: totalCartCount [Number] = sum of all quantities
    │
    ├─ <Navbar />                     -> src/components/Navbar.jsx   (sticky header, always visible)
    │    State: none
    │    Props: cartCount [Number], onOpenCart [Function]
    │    Callbacks: onOpenCart() sets isCartOpen to true in <App>
    │    Contains: logo <Link to="/">, "Catalog" <Link to="/">, cart badge <button> showing cartCount
    │
    ├─ <main>
    │  └─ <Routes>
    │     │
    │     ├─ <Route path="/">  ->  <CatalogPage />      -> src/pages/CatalogPage.jsx   [ROUTED PAGE]
    │     │    State: selectedGenre [String, default "All"]: the active genre filter
    │     │    Props: albums [Array of album objects], onAddToCart [Function]
    │     │    Callbacks: setSelectedGenre(genre) fires when a filter button is clicked
    │     │    Derived: filteredAlbums [Array] = albums filtered by selectedGenre
    │     │    Layout regions inside this page:
    │     │      ├─ Hero header (title and tagline)
    │     │      ├─ Genre filter bar: controlled button group (All, Jazz, Electronic, Rock, Classical)
    │     │      │    built with GENRES.map(); the active button gets the "active" class
    │     │      └─ Album grid (responsive CSS grid)
    │     │           └─ <AlbumCard />   -> src/components/AlbumCard.jsx   (rendered with .map())
    │     │                State: none
    │     │                Props: album [Object], onAddToCart [Function]
    │     │                Callbacks: onAddToCart(album) fires on "Add to Cart" (disabled if stock is 0)
    │     │                Contains: <Link to="/album/:id"> on the cover image and the title
    │     │
    │     ├─ <Route path="/album/:albumId">  ->  <AlbumDetailPage />   -> src/pages/AlbumDetailPage.jsx   [ROUTED PAGE]
    │     │    State: qty [Number, default 1]: quantity chosen before adding to the cart
    │     │    Props: albums [Array of album objects], onAddToCart [Function]
    │     │    Router hook: useParams() reads albumId from the URL
    │     │    Callbacks: onAddToCart(album, qty) fires on "Add to cart"; setQty() on the quantity input
    │     │    Conditional rendering:
    │     │      ├─ Album not found: "Album Not Found" message with a <Link> back to "/"
    │     │      ├─ Breadcrumb <Link> back to the catalog
    │     │      ├─ Cover image, title, artist, price, description
    │     │      ├─ Specs list (weight, catalog number, speed, label) and tracklist
    │     │      └─ Stock status, plus quantity input and add button only when stock > 0
    │     │
    │     └─ <Route path="/checkout">  ->  <CheckoutPage />   -> src/pages/CheckoutPage.jsx   [ROUTED PAGE]
    │          State:
    │            isSubmitted [Boolean, default false]: whether the order was placed
    │            formData [Object]: controlled inputs (fullName, address, city, postalCode,
    │                       cardNumber, expiry, cvv)
    │            errors [Object]: validation messages keyed by field name
    │          Props: cart [Array of album objects with quantity], onClearCart [Function]
    │          Callbacks:
    │            handleChange(event) updates formData as the user types (controlled inputs)
    │            handleSubmit(event) calls preventDefault(), validates, then sets isSubmitted
    │                       and calls onClearCart() when valid
    │          Conditional rendering (three views):
    │            ├─ Order confirmation (isSubmitted is true)
    │            ├─ Empty cart message with a <Link> back to "/" (cart is empty)
    │            └─ Checkout view:
    │                 ├─ Shipping and payment form (seven controlled inputs, inline error messages)
    │                 └─ Order summary card (line items, subtotal, 6% tax, total)
    │
    ├─ <Footer />                     -> src/components/Footer.jsx   (always visible)
    │    State: none
    │    Props: none
    │    Contains: logo and tagline, <Link>s to "/" and "/checkout", copyright line
    │
    └─ <CartDrawer />                 -> src/components/CartDrawer.jsx   (slide-over, outside <Routes>)
         State: none (visibility is controlled by isCartOpen in <App>)
         Props: isOpen [Boolean], cart [Array], onClose [Function],
                onUpdateQuantity [Function], onRemove [Function]
         Router hook: useNavigate() navigates to "/checkout"
         Callbacks:
           onClose() sets isCartOpen to false (overlay click or close button)
           onUpdateQuantity(albumId, delta) fires from the + and - buttons
           onRemove(albumId) fires from the Remove button
         Conditional rendering: renders nothing when isOpen is false; shows an empty-cart
           message when cart is empty; shows the subtotal and "Proceed to Checkout" button
           when it has items
         Contains: list of cart line items (cover, title, artist, line price, quantity controls)
```
