# VinylVault: Indie Record Online Store

VinylVault is a single-page React storefront for discovering vinyl records by genre, viewing detailed album information, managing a slide-over cart, and placing an order using a controlled form. Built with React and Vite, with client-side routing using `react-router-dom`.

---

## 1. Project setup and instructions for running

### Prerequisites

- **Node.js v21+** (preferably a recent LTS version like v22). Check using `node -v`
- **npm** (comes with Node.js). Check using `npm -v`
- **Git** for cloning the repo.
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection (album cover images fetched from Unsplash)

### Install

1. Clone the repo:

```bash
git clone https://github.com/ajacob2G502/ASGN_3
```

2. Navigate to the project directory:

```bash
cd https://github.com/ajacob2G502/ASGN_3
```

3. Install dependencies. Note that this will also install `react-router-dom` (which is already specified in `package.json`):

```bash
npm install
```

### Run dev server

1. Run the dev server:

```bash
npm run dev
```

2. It will display a local URL in the terminal, like `http://localhost:5173/`. Open it in browser.
3. Check if it's running:
   - You should see the VinylVault catalog with 8 albums, and buttons to filter by genre.
   - Clicking on an album should take you to its details page `/album/<id>` without a page reload.
   - Clicking "Cart" button in the header should open the slide-over cart drawer.
     Other commands: `npm run build` for production build, `npm run preview` to preview production build, `npm run lint` for ESLint.

### Overview of directory structure

The root directory contains configuration files (`index.html`, `vite.config.js`, `package.json`) and this README. All application code is in `src/`. `main.jsx` is the entry point that mounts the app, and `App.jsx` manages the shared state for the cart. Inside `src/`, `components/` contains reusable UI components, `pages/` has the 3 routed pages, `data/` has the `albums.js` dataset, and `assets/` has the image fallback files. Global styles in `src/styles.css`.

---

## 2. React component tree and state flow architecture

### Legend

- **State**: `useState` variables as `name [type]: purpose`
- **Props**: props received by the component (with types)
- **Callbacks**: functions passed between components, or defined to handle events
- **Route**: components rendered by React Router

### Component tree

```
<BrowserRouter>                       -> src/main.jsx
 └─ <App />                           -> src/App.jsx
    │  State (owner of all shared state):
    │    cart [Array of album objects, each has quantity field]: items in the cart
    │    isCartOpen [Boolean]: whether slide-over cart drawer is open
    │  Callbacks defined here (passed as props):
    │    handleAddToCart(album, quantity)   add album or increase quantity (up to stock)
    │    handleUpdateQuantity(albumId, delta)   update quantity (+/- 1), remove if quantity 0
    │    handleRemoveFromCart(albumId)   remove line item
    │    handleClearCart()   clear cart after checkout
    │  Derived value: totalCartCount [Number] = sum of all quantities
    │
    ├─ <Navbar />                     -> src/components/Navbar.jsx   (sticky header, always visible)
    │    State: none
    │    Props: cartCount [Number], onOpenCart [Function]
    │    Callbacks: onOpenCart() sets isCartOpen to true in <App>
    │    Contains: logo <Link to="/">, "Catalog" <Link to="/">, cart badge <button> with cartCount
    │
    ├─ <main>
    │  └─ <Routes>
    │     │
    │     ├─ <Route path="/">  ->  <CatalogPage />      -> src/pages/CatalogPage.jsx   [ROUTED PAGE]
    │     │    State: selectedGenre [String, default "All"]: active genre filter
    │     │    Props: albums [Array of album objects], onAddToCart [Function]
    │     │    Callbacks: setSelectedGenre(genre) when filter button is clicked
    │     │    Derived: filteredAlbums [Array] = albums filtered by selectedGenre
    │     │    Layout regions inside this page:
    │     │      ├─ Hero header (title and tagline)
    │     │      ├─ Genre filter bar: controlled button group (All, Jazz, Electronic, Rock, Classical)
    │     │      │    (using GENRES.map(); active button has "active" class)
    │     │      └─ Album grid (responsive CSS grid)
    │     │           └─ <AlbumCard />   -> src/components/AlbumCard.jsx   (rendered using .map())
    │     │                State: none
    │     │                Props: album [Object], onAddToCart [Function]
    │     │                Callbacks: onAddToCart(album) on "Add to Cart" button (disabled if stock is 0)
    │     │                Contains: <Link to="/album/:id"> on cover image, title
    │     │
    │     ├─ <Route path="/album/:albumId">  ->  <AlbumDetailPage />   -> src/pages/AlbumDetailPage.jsx   [ROUTED PAGE]
    │     │    State: qty [Number, default 1]: quantity to add to cart
    │     │    Props: albums [Array of album objects], onAddToCart [Function]
    │     │    Router hook: useParams() to get albumId from URL
    │     │    Callbacks: onAddToCart(album, qty) on "Add to cart" button; setQty() on quantity input
    │     │    Conditional rendering:
    │     │      ├─ Album not found: "Album Not Found" message with <Link> back to "/"
    │     │      ├─ Breadcrumb <Link> back to catalog
    │     │      ├─ Cover image, title, artist, price, description
    │     │      ├─ Specs list (weight, catalog number, speed, label), tracklist
    │     │      └─ Stock status; quantity input and add button only if stock > 0
    │     │
    │     └─ <Route path="/checkout">  ->  <CheckoutPage />   -> src/pages/CheckoutPage.jsx   [ROUTED PAGE]
    │          State:
    │            isSubmitted [Boolean, default false]: whether order was placed
    │            formData [Object]: controlled inputs (fullName, address, city, postalCode,
    │                       cardNumber, expiry, cvv)
    │            errors [Object]: validation errors, keyed by field name
    │          Props: cart [Array of album objects with quantity], onClearCart [Function]
    │          Callbacks:
    │            handleChange(event) to update formData as user types (controlled inputs)
    │            handleSubmit(event) to preventDefault(), validate, set isSubmitted, call onClearCart() if valid
    │          Conditional rendering (3 views):
    │            ├─ Order confirmation (if isSubmitted is true)
    │            ├─ Empty cart message with <Link> back to "/" (if cart is empty)
    │            └─ Checkout view:
    │                 ├─ Shipping and payment form (7 controlled inputs, inline error messages)
    │                 └─ Order summary card (line items, subtotal, 6% tax, total)
    │
    ├─ <Footer />                     -> src/components/Footer.jsx   (always visible)
    │    State: none
    │    Props: none
    │    Contains: logo and tagline, <Link> to "/" and "/checkout", copyright line
    │
    └─ <CartDrawer />                 -> src/components/CartDrawer.jsx   (slide-over, outside <Routes>)
         State: none (visibility controlled by isCartOpen in <App>)
         Props: isOpen [Boolean], cart [Array], onClose [Function],
                onUpdateQuantity [Function], onRemove [Function]
         Router hook: useNavigate() to navigate to "/checkout"
         Callbacks:
           onClose() to set isCartOpen to false (overlay click, close button)
           onUpdateQuantity(albumId, delta) on + and - buttons
           onRemove(albumId) on Remove button
         Conditional rendering: don't render if isOpen is false; show empty cart message
           if cart is empty; show subtotal and "Proceed to Checkout" button if there are items
         Contains: list of cart line items (cover, title, artist, line price, quantity controls)
```
