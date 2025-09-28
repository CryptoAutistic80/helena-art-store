# Fullstack Psychedelic Art E-commerce Implementation Plan

## Introduction and Overview

This project involves building a full-stack e-commerce platform for selling one-of-a-kind original artworks with a psychedelic, immersive design aesthetic. The goal is to create a visually striking online gallery where each artwork is unique (no variants or print editions), and to provide a smooth purchasing experience for customers. 

We will use a React frontend enhanced with Three.js (via the react-three-fiber library) to deliver interactive 3D visuals, and a Nest.js backend to handle business logic. Key features include Google OAuth for authentication, Stripe Checkout for payments in multiple currencies (GBP and USD), and shipping integration with a service like Shippo or EasyPost for real-time rates and label generation. Content management (art listings, artist bio, collection "drops") will be handled through a headless CMS (e.g. Sanity) so that new artworks and site content can be updated easily by non-developers. All components will be deployed on Google Cloud Platform (GCP) for scalability and reliability.

Below is a comprehensive technical and design roadmap covering architecture, tech stack, data models, UI/UX considerations, third-party integrations, deployment, and future enhancements. This plan emphasizes a modular, maintainable structure on both frontend and backend, while also ensuring a rich, accessible user experience in line with the psychedelic art theme.

## Technology Stack Summary

To meet the requirements, we have chosen a modern tech stack that balances creativity on the frontend with robustness on the backend. The table below summarizes the key technologies and their roles:

| Component | Technology Choices | Purpose |
|-----------|-------------------|---------|
| **Frontend** | React, Three.js (via react-three-fiber), Drei, React Router, CSS (Tailwind or custom) | Single-page application for UI/UX, 3D graphics, and client-side interactions. React-three-fiber enables declarative Three.js in React for immersive 3D content. Drei provides useful helpers (orbit controls, loaders, etc.). React Router manages page navigation within the SPA. |
| **Backend** | Nest.js (Node.js/Express framework), TypeScript, Passport (for auth) | Server-side API to handle business logic securely. NestJS provides a structured framework with modules, controllers, and services[1]. It will manage authentication, handle Stripe webhooks, process orders, and coordinate with external APIs (CMS, shipping). |
| **Database** | PostgreSQL (via TypeORM or Prisma ORM) | Persistent storage for transactional data: user profiles, orders, payments, and shipping info. A relational DB is suitable for querying orders and ensuring each artwork is sold only once. (Cloud SQL for Postgres on GCP can be used in production.) |
| **Headless CMS** | Sanity (or similar, e.g. Contentful) | Manage content for artworks, artist bio, and drop collections outside of the application code. Sanity provides a flexible content schema and real-time content database[2], allowing non-developers to add/edit artwork listings effortlessly. The frontend or backend will query the CMS to get the latest artwork data. |
| **Authentication** | Google OAuth 2.0 (Google Identity, via Passport strategy) | Allow users to log in with their Google account for a quick, secure signup/login flow. NestJS Passport will handle the OAuth exchange with Google[3] and issue a session or JWT for the frontend. |
| **Payments** | Stripe Checkout (Stripe JS SDK & REST API) | Secure payment processing for one-off purchases of artworks. We will use Stripe's hosted Checkout page for a simplified, PCI-compliant flow. The backend will create Checkout sessions with the Stripe SDK, specifying item details and currency, and handle webhooks for payment confirmation[1]. Multiple currencies (GBP, USD) are supported by creating charges in the selected currency (Stripe can handle conversion to the account's settlement currency if needed[4]). |
| **Shipping** | Shippo or EasyPost (Node SDK / API) | Real-time shipping rate calculation and label purchasing. Using a shipping API like Shippo allows integration with multiple carriers (e.g. Royal Mail, UPS, USPS, DHL) through one interface[5]. This automates fetching rates at checkout and generating shipping labels once an order is paid. |
| **Deployment** | Google Cloud Platform – Cloud Run, Cloud Storage, CDN, Secret Manager | Host the containerized NestJS backend on Cloud Run (serverless containers with autoscaling). The React frontend will be a static bundle deployed to either Cloud Run (as a static server) or Cloud Storage + Cloud CDN for efficient delivery. GCP's Secret Manager will store API keys (Stripe secret, Google OAuth client secret, etc.), and Cloud Build/CI can automate deployments. |
| **3D & Graphics** | Three.js, WebGL, React Three Fiber, GLSL shaders | Used within the frontend to create psychedelic visual effects (animated backgrounds, interactive 3D gallery displays, etc.). Custom shaders (GLSL) and Three.js materials will produce effects like vibrant colors, distortion, and motion which define the site's unique aesthetic. |
| **Testing & Tools** | Jest (for unit tests), Cypress (for end-to-end tests), ESLint/Prettier | Ensure code reliability and maintain style. End-to-end tests will cover flows like login, adding to cart, and checkout to catch any integration issues. Monitoring tools (Google Cloud Monitoring, Sentry) will be integrated to track performance and errors in production. |

This stack provides a solid foundation to implement all required features while supporting an immersive 3D user experience and maintaining scalability and security on the backend.

## System Architecture Overview

The high-level architecture consists of a decoupled frontend and backend that communicate via REST APIs. The CMS and third-party services (Stripe, Shippo) are also integrated as shown below:

### Architecture Components

- **Client-side (React & Three.js)**: A single-page React application provides the interactive UI. It communicates with the NestJS API via HTTP (HTTPS) requests for data (artwork listings, user profile, order creation, etc.). The React app will also directly interact with some third-party SDKs on the client side when appropriate – for example, the Stripe.js library to redirect to Checkout, and the Google OAuth client for sign-in (or this can be done via backend redirects). The heavy 3D rendering is done in the browser using WebGL through Three.js.

- **Server-side (NestJS)**: The backend is organized into modules (Auth, Products, Orders, Payments, Shipping, etc.) and exposes RESTful endpoints for the frontend to call. It also handles webhooks from Stripe (for payment events) and possibly from the CMS (if we use CMS webhooks on content publish). The server contains the logic to ensure each artwork can only be purchased once – when an order is initiated, it can lock or mark the item as reserved/sold to prevent race conditions.

- **Headless CMS (Sanity)**: Sanity acts as a content store for artworks and related data. The CMS can be queried from the frontend or backend. Two possible approaches: 
  1. **Backend proxy** – NestJS fetches artwork data from Sanity's API (using Sanity's Node client or HTTP requests) and then serves it to the React app via its own endpoints (this approach can simplify filtering out sold items and merging with DB info like stock status). 
  2. **Direct from frontend** – the React app uses Sanity's client-side API to fetch public content (read-only). In either case, Sanity holds fields like artwork title, description, images, and base price in each currency. Because Sanity updates in real-time, new art drops or edits to content can appear on the site immediately without redeploying the frontend.

- **Database (Postgres)**: The database stores essential e-commerce data that is transactional or sensitive, which we may not want solely in the CMS. This includes user accounts (or at least their internal IDs and roles, since OAuth provides Google IDs/email), order records, and possibly a record of artworks that have been sold. Even though the art details (name, image, price) come from the CMS, once an artwork is sold we will record that sale in the Orders table and mark the item as sold. We might include an artworkId reference in the Orders table that corresponds to the CMS document ID, enabling us to join or lookup additional info if needed. The NestJS server will use an ORM to interact with Postgres.

- **Stripe Integration**: We will use Stripe in two ways – client-side via Stripe.js to handle the secure payment UI, and server-side via the Stripe Node library for creating checkout sessions and processing webhooks. When a user is ready to purchase, the frontend will call a backend endpoint (e.g. POST /orders/checkout) which triggers NestJS to create a Stripe Checkout Session (including line items like the artwork name, price, currency, and quantity = 1) using the Stripe SDK[6][7]. The user is then redirected to Stripe's hosted checkout page to enter payment details. After payment, Stripe will send a webhook to our backend (to confirm payment success), and also redirect the user back to our frontend's confirmation page. The backend's webhook handler will mark the order as paid and initiate the shipping label purchase.

- **Shipping Integration**: The server will integrate with Shippo or EasyPost via their REST API/SDK to handle shipping. The process is: when the user enters their address (either collected via Stripe Checkout or via a form on our site before payment), we use that address and the package details (e.g. dimensions/weight of the artwork) to fetch rates from carriers. The frontend can call an endpoint like GET /shipping/rates?country=XX&... which NestJS implements by calling Shippo's API for rate quotes. These rates (e.g. standard vs express shipping costs) are returned to the frontend for the user to choose one, or we can automatically select a default shipping option (like cheapest or fastest). Once an order is paid, the backend uses Shippo to purchase the chosen shipping label and obtains a PDF or label URL. This can be emailed to the site admin or automatically sent to a connected printer. Using Shippo's unified API simplifies dealing with multiple carriers and services (they handle integration to USPS, UPS, DHL, etc., and provide tracking)[5].

- **Google Cloud Deployment**: Both the frontend and backend will be deployed on GCP. The NestJS API will run in a Docker container on Cloud Run, which provides autoscaling and a secure runtime. The static frontend build (HTML, JS, CSS, assets) can be served via Cloud Storage + Cloud CDN for global low-latency delivery, or alternatively packaged into a lightweight Node.js server and also run on Cloud Run (for simplicity, we might use separate Cloud Run services for frontend and backend). We will use a custom domain (e.g. exampleart.com) with HTTPS, configured in Cloud Run or Load Balancer. Environment secrets (Stripe secret key, OAuth client secret, database credentials, etc.) will be stored in GCP Secret Manager and injected into the Cloud Run environment variables at runtime, keeping them secure.

### Architecture Flow Summary

In summary, the flow is: **React App (browser) ⇄ NestJS API ⇄ (Database, CMS, Stripe, Shippo)**. The React App also directly interacts with Google OAuth and Stripe.js for portions of the flow. The NestJS backend acts as the central hub orchestrating data between the database, the CMS, and external services like Stripe and Shippo, enforcing business rules (like "an artwork can only be sold once"). All components are loosely coupled via clear API boundaries, which makes the system easier to maintain and extend in the future.

## Frontend Architecture and Implementation

### Structure and Frameworks

The frontend is a single-page application (SPA) built with React. Using React lets us create a dynamic, responsive UI and integrate the Three.js 3D content seamlessly. We will use create-react-app or Vite to scaffold the project, organizing the code in a modular way. A possible folder structure for the React app:

```
frontend/
 ├── public/              # Static public assets (favicon, index.html, etc.)
 └── src/
     ├── components/      # Reusable React components (buttons, layout, etc.)
     ├── pages/           # Page-level components for routes (Gallery, ArtworkDetail, Cart, Profile)
     ├── three/           # Custom Three.js related code (e.g. Canvas scenes, shaders, 3D models)
     ├── styles/          # CSS/Tailwind styles or styled-components
     ├── hooks/           # Custom React hooks (e.g. for responsive design or animations)
     ├── context/         # Context providers or Redux slices for global state (cart, user, etc.)
     ├── utils/           # Utility functions (e.g. currency formatting, helpers)
     └── main.jsx         # App entry point (renders the Router and Canvas)
```

We will set up React Router for client-side routing. The main routes likely include: Homepage/Gallery (displays list of artworks, possibly in a 3D gallery format), Artwork Detail page (with a closer view of an individual artwork and a purchase button), User Profile/Orders (if logged in, to view past orders or status), and possibly pages like About/Bio and Contact. Because this is an SPA, navigation between pages will not reload the whole site, which allows us to maintain background 3D animations (we can have persistent Three.js canvas that continues animating across routes, for example).

We will manage application state for things like the shopping cart and current user using either the React Context API or a state management library (for a small app, React Context with hooks is likely sufficient). For example, a CartProvider context can hold the cart items (though since each artwork is unique, the cart is essentially a list of unique items; no quantity >1 for any item). The currency selection (GBP or USD) can also be part of global state, so that all prices shown reflect the chosen currency. We might default the currency based on the user's locale or have a toggle in the UI.

### UI Design and Styling

Given the "psychedelic" aesthetic, we plan to use vibrant, high-contrast colors, bold typography, and fluid, animated backgrounds. We will likely use custom CSS or a utility-first framework like Tailwind CSS for rapid styling. Tailwind would allow us to easily apply custom color palettes and responsive styles, but we will override and extend it to include neon-like color themes and perhaps a funky font for headings. 

Key design elements include:

- A dark or neutral background to let the art and colors pop (e.g. black or deep purple backdrop with neon accents)
- Animated background canvas using Three.js – for instance, swirling color patterns, shifting fractal shapes, or subtle psychedelic animations behind the content. This can create an immersive atmosphere without distracting from the artworks
- Hover and transition effects that are smooth and perhaps 3D: e.g., when hovering over an artwork thumbnail, it might gently rotate or morph with a shader effect
- Use of 3D models for decorative elements: we could incorporate thematic 3D objects (like abstract shapes, or a "portal" effect when entering the site) to reinforce the brand identity

We will ensure that the visual design remains usable: psychedelic design can be mesmerizing but should not overwhelm the user's ability to navigate. So, we'll keep the layout intuitive (e.g. a clear menu, consistent placement of "Cart" and "Login" buttons, etc.) while applying creative visuals within and around that structure.

### 3D Interactive Features with Three.js

One of the standout features of the frontend is the integration of Three.js via react-three-fiber (R3F) to create an immersive 3D experience. React-three-fiber allows us to build Three.js scenes as part of React's render tree, making it easier to manage alongside normal React components. We will also utilize @react-three/drei (a helper library) for common 3D components and effects like orbit controls, environment lighting, and loaders.

#### Planned 3D Interactions

- **Interactive Gallery Scene**: The main gallery page could be a 3D space where artwork images are displayed as textured planes or even as picture frames on a wall in a virtual gallery. For example, we can set up a Three.js Canvas that covers the background of the page, and render each artwork as a plane with its image texture. Users could scroll or drag to navigate through this space. We might implement a camera that slides horizontally/vertically as the user scrolls, creating a parallax 3D scroll effect[8]. Another approach is a carousel or "3D slideshow" of artworks that the user can flip through (using Drei's ScrollControls or a custom control)[9]. This makes browsing more engaging than a static grid of images. Each artwork plane can have a slight hover effect (e.g., scale up or glow) when the user's pointer is over it, indicating it's clickable.

- **Artwork Detail View in 3D**: When a user selects an artwork, instead of a plain 2D page, we can transition into a 3D detail view. For instance, the thumbnail the user clicked could smoothly animate forward, enlarging into focus (a sort of zoom-in transition in 3D space). The detail page might present the artwork in high resolution on a large plane or perhaps as part of a 3D scene (imagine the artwork on an easel or floating in space with particles around it). We can overlay the UI for title, description, price, and a "Buy" button on top of this scene. Transitions between gallery and detail can be enriched with effects like a camera fly-through or a portal effect (possibly using shader transitions to melt one scene into another). By leveraging Three.js for transitions, we can achieve effects far more creative than standard page fades – aligning with the psychedelic vibe.

- **Psychedelic Visual Effects**: To truly embrace the theme, we will implement some generative or shader-based effects. Possibilities include: color-shifting animated backgrounds, where fragment shaders cycle through trippy color spectrums; kaleidoscopic patterns or mirror effects that respond to user interaction (e.g., a background that warps or "trails" as the user moves the mouse, creating a hallucination-like effect); or even interactive elements like a fluid simulation that users can play with in the background. For inspiration, there are many "trippy" WebGL examples – e.g., an infinite fractal vine growth (like the Canopy project, which lets users journey through an endless growing plant[10]) or a zoom quilt effect of art (where the artwork details could zoom infinitely into a repeating pattern). We will choose a few such effects that complement the art without overshadowing it. Possibly, the homepage could feature an animated canvas behind the content that shows an evolving abstract pattern, generated by a shader, to set the mood.

- **Three.js Models & Animations**: If the artist has 3D models or objects to incorporate (or if we create our own thematic models), we can include those in scenes. For example, floating geometric shapes that rotate slowly on the homepage, or particles that emit when an item is added to cart (like confetti of bright colors). We might use GLTF models loaded via Drei's `<useGLTF>` for any complex objects. For performance, we will keep poly counts low and use techniques like instancing for any repeated objects.

- **Performance Optimizations**: Using WebGL in a web app requires careful performance tuning, especially for mobile. We will use techniques such as framerate limiting or disabling certain effects on low-power devices. The react-three-fiber library allows us to easily adjust the rendering by controlling when the canvas needs to update. We can take advantage of Drei's `<Preload />` and `<adaptiveDpr />` to optimize rendering resolution on the fly. We will also ensure to dispose of Three.js objects correctly to avoid memory leaks. For complex shaders or scenes, providing a toggle for "low graphics" mode or automatically detecting if the device is mobile (then simplifying effects) can help maintain smooth UX. Additionally, we'll use lazy loading for 3D assets – the initial load will show a minimal scene or a stylish loading animation (perhaps a spinning psychedelic icon) while heavier content streams in.

Overall, the frontend will be a blend of standard React UI for forms, text, and buttons, combined with an always-present Three.js canvas that delivers playful visuals consistent with the art's style. The result should "mesmerize" users with psychedelic visuals while still allowing them to easily find and buy art. As one review of creative sites notes, basic web technologies in the right hands can produce truly out-of-this-world, psychedelic experiences on the web[11]. We aim to achieve that by leveraging modern web graphics in our React app.

## User Authentication (Google OAuth Flow)

For authentication, we will implement Google OAuth 2.0 login to make account creation frictionless. From the UI perspective, there will be a "Sign In with Google" option (likely a button on the navbar or upon checkout if login is required to purchase). The flow works as follows:

### OAuth Flow Steps

1. **User Clicks "Sign in with Google"**: We trigger the OAuth flow. This can be done via a pop-up or redirect. A common approach in SPAs is to have the backend handle OAuth redirection. For example, clicking the button could open a new window hitting an endpoint on our NestJS backend like `/auth/google` which is configured to use Passport's GoogleStrategy.

2. **Google Consent**: Google will display a consent screen for the user to select their account and grant permission (we'll request basic profile info and email). This requires that we have set up a Google API project and OAuth client ID in the Google Cloud Console. We will have configured our OAuth credentials with the authorized redirect URI pointing to our backend (e.g. `https://api.exampleart.com/auth/google/callback`).

3. **OAuth Callback**: After the user consents, Google sends an auth code to our callback URL. NestJS (with Passport) will handle this in the background – Passport's GoogleStrategy will use the code to fetch the user's profile (Google ID, name, email). We will then either create a new user in our database (if first time) or find the existing user. We won't be handling any passwords since it's OAuth; instead, we might create a JWT for the session. The NestJS AuthModule will likely issue a signed JWT token that encodes the user's ID and some info. We can then redirect or send that token back to the frontend.

4. **Frontend Receives Auth Token**: If we used a popup, the backend might respond with a small HTML that posts the JWT to the opener window. Alternatively, if redirect, we'll land on a frontend route like `/auth/success?token=...`. The React app will capture the token (e.g., from URL or a cookie) and store it (likely in memory or localStorage if needed). We will from now on attach this token in the Authorization header for any API calls that require auth (like viewing order history). The user is now considered "logged in". We'll also store basic profile info (name, avatar URL) from Google to display in the UI (e.g. "Hello, [Name]").

5. **Auth Module in NestJS**: On the backend side, we utilize `@nestjs/passport` and the `passport-google-oauth20` strategy to implement this. The GoogleStrategy configuration will include our Google client ID/secret and the callback URL. NestJS makes it straightforward to plug this in and protect routes with an AuthGuard for JWT after login. The integration is documented and widely used[3]. We will ensure to validate the JWT on each request (using Passport's JWT strategy) to secure protected endpoints.

### Authentication Considerations

One advantage of using Google OAuth is that we get verified emails and don't need to implement our own email/password or confirmation flows. It's also convenient for users. However, we will also consider users who don't want to log in: we might allow "guest checkout". The requirement didn't explicitly say if login is required for purchase. If it isn't, we can make account creation optional (Stripe can collect the email for receipts even if not logged in). But having accounts is useful for order tracking. We might implement it such that a Google login is optional – if a user checks out as guest, we still create an Order but without a user ID (or we generate a one-time link for them to see status, emailed to them). This detail can be refined based on stakeholder preference.

In summary, the frontend will have a Google login button and possibly a small user menu (showing profile or logout when logged in). The integration with NestJS authentication will ensure a secure, seamless login experience using industry-standard OAuth 2.0.

## E-commerce UI and Checkout UX

From a usability standpoint, we will design the purchasing flow to be straightforward:

- Users browse the artwork gallery (with filtering or sorting if needed – though initially all items are unique, we might just show all or allow filter by "drop" or by price range)
- Users can click an artwork to view details on a dedicated page
- On the detail view, a "Buy Now" button will initiate purchase

Since quantity is always one and there's no selection of variants, we don't need a complex add-to-cart for multiples or variant pickers. However, we might still implement a simple shopping cart if we want to allow users to continue browsing and add multiple different artworks before checkout (e.g. buying two different paintings in one order). If so, the detail page would have "Add to Cart" which puts the item into a cart state (and probably immediately disables further adding or marks it reserved). The cart page would list selected artworks (each at quantity 1) and a checkout button. 

Given the exclusivity, we must also ensure if the user doesn't check out promptly, the items aren't purchased by someone else – we might not enforce a hold unless we implement reservations. Initially, we can keep it simple: whoever checks out first gets it; if someone else tries to buy the same item later, the backend will prevent it (since it's marked sold). We'll provide appropriate feedback in such a case ("Sorry, this artwork just sold out").

### Stripe Checkout Integration

When the user proceeds to Checkout, we will integrate with Stripe Checkout. The frontend either redirects the user to the Stripe Checkout page by receiving a URL from the backend, or uses Stripe's JS to open a Checkout session. Concretely, the React app will call an endpoint like `POST /orders/create-checkout-session` with the item(s) the user wants to buy. The backend Stripe service will create a Checkout Session including line items:

- Name and image of the artwork(s) (we can pass an image URL for Stripe to display)
- The price in the chosen currency
- Quantity 1 each

We'll also include shipping options if Stripe is to collect shipping. Stripe allows adding predefined shipping rates or asking for an address. We might leverage that by creating a few Shipping Rate objects (e.g. "Standard UK", "International Express" with fixed or approximate prices) to attach to the session. Alternatively, we collect address on our site and compute shipping, as discussed earlier. We will likely let Stripe collect the address to avoid double entry by the user, then use that address to compute and charge shipping ourselves. A simpler path: include a flat shipping fee for domestic vs international in the price or as a separate line item.

The endpoint will then respond with the sessionId or a full Checkout URL. The frontend will then use `stripe.redirectToCheckout({ sessionId })` (via Stripe.js) to send the user to the secure Stripe page. At this point, Stripe handles payment input (cards, Apple Pay, etc.), which is great for PCI compliance and convenience.

### Post-Payment Flow

- **After payment**, Stripe will redirect back to our site (we configure a return URL in the session). We'll have a route like `/order/success` that the user lands on. That page will use the session ID (from URL or by fetching the CheckoutSession via backend if needed) to show a confirmation: e.g., "Thank you! Your purchase was successful." It can show an order summary. Meanwhile, in the background, the Stripe webhook will have notified our backend. Our backend will verify the event (using Stripe's signing secret for security) and then mark the order as paid, store the Stripe charge ID, and trigger shipping label creation.

- **The frontend on the success page** could also prompt the user to check their email for a receipt or next steps (we can have Stripe send an email receipt, plus we might send a follow-up email with shipping tracking once available).

This checkout UX is largely handled by Stripe's system, which is reliable and supports all major payment methods (and automatically handles currency conversion if needed). It also supports multi-currency seamlessly; we just have to specify the correct currency when creating the payment[7].

### Additional Considerations

Additionally, we will integrate Stripe webhooks not only for successful payment, but also for events like failed payment or if a Checkout Session expires without completion. The backend can listen for a `checkout.session.expired` or `payment_intent.canceled` event to possibly release a hold on an artwork. For MVP, we might not implement an explicit hold, but if we did (marking an artwork as "reserved" when a checkout session is created), the webhook would tell us to release it if unpaid after some time.

Finally, in terms of responsive design: The React app will be built mobile-first. We expect many users might view art on mobile devices, so the layout should adapt (e.g., the gallery might become a vertical scroll list with smaller thumbnails on phones, and the 3D effects might be toned down). We will test and ensure that even on a small screen, the purchase button and info are easily accessible, and the site remains visually interesting (perhaps with subtle animations instead of large canvases to keep performance). Media queries or dynamic rendering logic in React will be used to adjust the experience.

To summarize, the frontend will deliver a rich, interactive user experience combining standard e-commerce interface elements with unique 3D visuals. It will remain accessible and performant through careful design choices and progressive enhancement for the psychedelic features.

## Backend Architecture and Implementation

The backend will be implemented with Nest.js, a Node.js framework that enforces a modular architecture and comes with out-of-the-box support for things like dependency injection, middleware, and decorators that align well with our needs (validation, authentication, etc.). The backend's responsibilities include: serving product (artwork) data via an API, handling user authentication sessions, creating Stripe checkout sessions and processing webhooks, managing order records and inventory (ensuring artworks aren't double-sold), and interfacing with the CMS and shipping services.

### Project Structure and Modules

Nest.js encourages splitting features into modules for clarity and reuse. We will structure the backend into modules corresponding to different domains of the application. Here's a likely module breakdown (with inspiration from typical e-commerce backend designs[12]):

#### Core Modules

- **AuthModule**: Manages authentication strategies and user session logic. This includes the Google OAuth strategy (Passport strategy and its verifier) and possibly a JWT strategy for protecting API routes. It will have a controller for OAuth callbacks and possibly endpoints for refreshing tokens or logging out (if needed). Technologies: `@nestjs/passport`, `passport-google-oauth20`, `passport-jwt`, etc.

- **UsersModule**: CRUD for user accounts. Since most user data comes from Google, this module is fairly simple – it defines the User entity (with fields like id, name, email, googleId, role), and a service to find or create users. It might also include a profile endpoint if we allow users to fetch or update their profile (though with Google login, profile updates might be minimal, maybe just a nickname or preferences like preferred currency).

- **ProductsModule**: In a classic e-commerce, this would handle product catalog management. In our case, product data is primarily in the CMS. We may still create a Product entity on the backend that mirrors some of those fields or at least contains a reference (like a Sanity document ID or slug) and maybe a "status" (available or sold). Alternatively, we might treat the CMS as the source of truth and not have a local Product entity at all. For simplicity, we might not store products in the DB, instead query the CMS on the fly. However, consider performance: if the CMS is cloud-hosted (Sanity's Content Lake), queries are fast, but it might be wise to cache product data or sync them. A middle-ground: store only minimal info needed for transactions – e.g. store an Artwork record only when it's sold (archiving the price, title, etc used at purchase time for record-keeping). Initially, the ProductsModule can have a controller that fetches all artworks by querying the CMS (perhaps via a Sanity client SDK call). It can also provide a route for a single artwork by id or slug. We'll implement caching or caching headers if needed to reduce load (Sanity responses can be cached since content changes are infrequent and done by admin only).

- **OrdersModule**: Handles order placement and order history. This module will define the Order entity in the database. An Order links a User (or guest email), one or more artworks (line items), the amount, currency, shipping info, Stripe payment status, etc. We will design the Order table with fields like: id, userId (nullable for guests), totalAmount, currency, paymentIntentId/checkoutSessionId, status (e.g. PAID, PENDING, CANCELED), shippingAddress (could be a JSON or a foreign key to an Address table), shippingTracking, createdAt, updatedAt. Because each artwork is unique, we can simplify line items: perhaps the order links directly to a single artwork ID (if we restrict one artwork per order). However, supporting multiple artworks in one order (cart with multiple items) is also possible – then we'd have an OrderItems table or we store an array of artwork IDs in the order (normalized vs not). A normalized approach: an OrderItem entity with fields (orderId, artworkId, price). For now, it might be okay to assume one artwork per order to simplify, but we'll keep the schema flexible. The OrdersModule will have a service to create a new order record when a checkout is initiated (status "Pending") and update it upon payment completion ("Paid"). It will also interact with Stripe and shipping: i.e., the controller for creating a checkout session will belong here or in a PaymentsModule (depending on separation of concerns).

- **PaymentsModule**: We might include a separate module for payment integration (Stripe). This module would have a service that wraps the Stripe Node SDK calls and a controller or two: one for initiating checkout (as mentioned), and one for the Stripe webhook endpoint (e.g. `/webhook/stripe`). The Stripe webhook handling is critical – it will verify the signature and then parse events like `checkout.session.completed` to find the relevant order (we might store the Stripe session ID or payment intent ID in our pending Order before) and then mark the order paid and trigger the next steps (like calling Shippo). We will secure the webhook endpoint by only allowing Stripe's IP or using the signed secret.

- **ShippingModule**: This module will encapsulate interaction with Shippo/EasyPost. It might include a service that has methods like `getRates(address)` and `purchaseLabel(orderId)`. When the order is marked paid, the OrdersService can call ShippingService.purchaseLabel, which will use the Shippo SDK. The shipping module may also manage an Address entity if we choose to store addresses in the DB (though we might not need to persist addresses beyond the order, unless we want users to have saved addresses). Alternatively, addresses can just be stored within the Order details JSON. The ShippingModule could also handle webhooks from Shippo (for example, if we want to get tracking updates via webhook). Shippo can send tracking status updates that we could listen for and update order status to "Delivered" etc., but that's an advanced feature we might add later.

- **CMS Integration**: We might not need a full module here, but possibly a ContentModule that handles retrieving data from Sanity. It could have services to fetch artworks, drops, and the bio page content using Sanity's APIs. If we secure the CMS with an API token, these calls should originate from the backend (so the token isn't exposed to front-end). We will store the Sanity API credentials in environment config and use them in this module. The ContentModule basically replaces a typical "ProductsService" that would normally fetch from a local DB; here it fetches from Sanity's dataset (possibly caching results in memory for short duration to reduce external calls). Sanity uses GROQ or GraphQL queries – we can either use their Node client and GROQ queries to get what we need in one request (for example, a query to get all unsold artworks with fields we need). We'll incorporate such queries into this module.

#### Module Organization

Each module will have corresponding Controllers (defining the API endpoints), Services (business logic), and Entities or Schemas (for database models if needed). NestJS fosters this pattern to keep code organized. For example, the AuthController will have routes for OAuth redirect and callback; the OrdersController might have `POST /orders/checkout` and `GET /orders/:id` (for order status); the ProductsController might have `GET /artworks` and `GET /artworks/:slug`. We will also use DTOs (Data Transfer Objects) with Nest's validation pipe to ensure incoming data is valid (e.g., if we had an endpoint to create a new artwork – though likely not in public API, maybe for admin – we'd validate the payload).

#### Security and Middleware

Nest's middleware or guards will be used for security: we will secure routes like order history (only logged-in users can fetch their orders) using an AuthGuard that checks JWT. Also, rate limiting middleware might be applied to sensitive routes (to prevent abuse of the payment or login endpoints).

One notable global middleware would be a Stripe raw body parser for the webhook route, since Stripe requires the exact raw request body to verify signature. We'll configure that appropriately in `main.ts` (Nest allows you to apply different body parsing to certain routes).

#### Backend Folder Structure

In terms of folder layout for backend:

```
backend/
 ├── src/
 │    ├── app.module.ts            # Root module imports all feature modules
 │    ├── main.ts                  # Entry point to bootstrap the Nest app
 │    ├── config/                  # Configuration files (e.g., for environment variables)
 │    ├── auth/    (AuthModule with controller, service, strategies)
 │    ├── users/   (UsersModule with user.entity.ts, users.service.ts, users.controller.ts)
 │    ├── products/ (ProductsModule, possibly no entity, just service calling CMS)
 │    ├── orders/  (OrdersModule with order.entity.ts, orders.service.ts, orders.controller.ts, order-item.entity.ts)
 │    ├── payments/ (PaymentsModule with Stripe integration, webhook controller)
 │    ├── shipping/ (ShippingModule with integration to Shippo, shipping.service.ts)
 │    └── cms/      (ContentModule, optional, for CMS integration logic)
 ├── test/    (for e2e tests with Jest)
 └── nest-cli.json, tsconfig.json, etc.
```

This organization follows NestJS best practices and keeps each concern separate[12]. For instance, if in the future we want to support additional payment gateways or authentication providers, we could add modules or extend these.

### Database Models and Relations

We will use TypeORM or Prisma to define our database schema in a code-first manner. Key entities (and their relationship) we plan to have:

#### Core Entities

- **User**: `id` (PK), `name`, `email`, `googleId` (unique), `role` (enum: customer/admin), `createdAt`.
  
  We mark `googleId` as unique so we don't create duplicates. If we later support other login methods, we might have to handle that differently (like a separate OAuth table), but for now one user corresponds to one Google account. We might have a boolean for `isAdmin` if we want an admin user to access admin APIs.

- **Order**: `id` (PK), `userId` (FK to User, nullable for guest), `totalAmount`, `currency`, `stripeSessionId`, `paymentStatus`, `shippingStatus`, `shippingAddress` (could be broken into fields or JSON for simplicity), `trackingNumber`, `createdAt`, `updatedAt`.
  
  The `paymentStatus` might be an enum: e.g. PENDING, PAID, REFUNDED. `shippingStatus` can be: PENDING (not shipped), SHIPPED, DELIVERED, etc. We'll update that as we create labels and as tracking says delivered. The `totalAmount` and `currency` are stored for record (even though we can recompute from items, it's good to snapshot what was charged). `stripeSessionId` or `paymentIntentId` helps us map Stripe webhooks to this order. If using Stripe Checkout, we might primarily use `checkoutSessionId`. We will also store `trackingNumber` (and maybe carrier) once generated by Shippo for reference.

- **OrderItem**: (if supporting multiple items per order) `id`, `orderId` (FK), `artworkId` (or artwork slug), `title`, `price`, `currency`.
  
  We might de-normalize some info (store the title and price at purchase time in case the CMS data changes later). However, since each artwork is unique, storing item records is a bit optional – we could just have one artwork per order field. But to be safe for expansion (like if later digital downloads can allow multiple items), it's better to have an OrderItem table. We can link to an `artworkId` that references the CMS. Since the CMS item is not a SQL table, we could just store the Sanity document ID or slug as a string. There's no true foreign key constraint to CMS, but that's fine.

- **Artwork** (optional local cache): `id`, `title`, `slug`, `priceGBP`, `priceUSD`, `isSold` (bool), `drop` (ref or name), etc.
  
  This would exist only if we want to maintain a local copy of artworks. We might skip this initially to avoid duplication of data with CMS. Instead, to check if sold, we would search the Orders table. However, adding an `isSold` flag updated on sale could allow quick queries. Another approach: maintain a simple table of sold artwork IDs. The CMS itself could also store a "sold" flag if we update it via their API on sale (Sanity allows writes via mutation API; we could automate marking sold to show "Sold Out" on the site). We'll decide on one source of truth for availability – either the DB or CMS. To keep the CMS authoritative for content and the DB authoritative for transactions, a balanced solution is: when an order is completed, mark the item as sold in both places (set `isSold=true` in our system and send a mutation to Sanity to mark it, so if the CMS drives the frontend listing, it can filter out sold items or show them as sold).

- **Address** (optional): If we normalize shipping addresses, `id`, `userId` (optional if saved address), `name`, `line1`, `line2`, `city`, `state`, `country`, `zip`, etc. For simplicity, we might store the shipping info directly in Order as mentioned, unless we want to allow user address book for repeat customers. Early on, that might be overkill.

Other tables we might consider for future (not needed now): Drop (to store info about a collection release, though CMS likely handles that), Payment separate from Order (but since one order corresponds to one payment in our case, we can combine them), etc.

Using TypeORM, we'll annotate these as entities and define relations (OneToMany: User->Orders, OneToMany: Order->OrderItems). Using Prisma, we'd define a schema with similar relations. We will also use database migrations to keep schema in sync (Nest has a CLI for TypeORM migrations or we use Prisma migrate).

### API Endpoints

We will design clean RESTful API endpoints for the frontend to use. Some key endpoints include:

#### Public Product APIs

- `GET /artworks` – Returns list of available artworks (and possibly some metadata like total count, or handle pagination if needed). This will fetch from CMS. We can allow filters via query params, e.g. `?currency=USD` if we want to return prices in a specific currency (or we return both and let front choose). Likely, we will return all necessary fields including an indicator if an artwork is sold. If the CMS already excludes sold ones (assuming we mark them), then it's just available ones.

- `GET /artworks/:slug` – Returns detail for a specific artwork, including all fields like description, images, etc. If slug not found or item sold, return 404 or flag accordingly.

These calls might be handled by the Content/CMS module on backend.

#### Auth APIs

- `GET /auth/google` – Initiates Google OAuth (redirects to Google).
- `GET /auth/google/callback` – Callback URL Google calls, which our server handles (Passport) then redirects to front-end.
- `POST /auth/logout` (maybe) – Invalidate a JWT (if we use stateless JWT, logout is mostly front-end deletion of token, unless we keep a token blacklist). Possibly unnecessary with Google-only login.

#### User APIs

- `GET /me` – Returns current logged-in user profile (useful for frontend to verify login via JWT).
- `GET /orders/my` – List orders of the logged-in user. (If guest checkouts exist, they won't have this ability unless we match by email).
- Possibly `PUT /users/me` for updating a profile if needed (not a priority).

#### Cart/Order APIs

- If using a cart system: `POST /cart` to create a cart or add item, `DELETE /cart/:itemId` to remove, `GET /cart` to fetch current cart. However, since our cart is very lightweight (and can even be just front-end state until checkout), we might not need server-side cart persistence. If we want the cart to persist across sessions for a user, we could implement it, but with one-of-a-kind items, leaving items in cart for long is problematic (they might sell to someone else). So likely we'll manage cart on client side and only involve server at checkout time.

- `POST /orders/checkout` – This is a crucial endpoint. The frontend will call this to initiate a purchase. The request body might include the artwork IDs being purchased and the chosen currency. The backend will:
  a. Validate the items (e.g. ensure they are still available and not already sold or being bought concurrently; possibly place a temporary hold by marking them reserved in DB).
  b. Create an Order record with status PENDING.
  c. Call Stripe to create a Checkout Session for those items (with the correct currency and price).
  d. Save the Stripe session ID in the Order.
  e. Respond with the Session ID (or a URL).
  
  This endpoint likely requires authentication (so we can tie the order to a user if logged in), but we could allow a guest to also create an order by providing an email/address in the request.

- `POST /webhook/stripe` – Endpoint for Stripe webhooks (not called by frontend, but by Stripe). The controller will receive events; on a successful payment event, mark order paid and proceed with fulfillment. We will respond with 200 quickly after processing to acknowledge to Stripe.
  
  (We might also handle other events: e.g., if payment fails, cancel the pending order and free the item; if refund events occur, etc., but those are secondary).

- `GET /orders/:id` – For retrieving a specific order's details (could be used on the order confirmation page to get the official record including shipping tracking once available). This will check that the requester is the owner (or admin).

#### Shipping APIs

(These could be part of Orders or separate)

- `GET /shipping/rates` – Frontend can hit this with `?country=XX&postalCode=YY` etc to get a list of shipping options and costs. The backend will call Shippo's rate API and return a simplified list (service name, estimated days, cost). This allows dynamic shipping cost calculation if not using Stripe's built-in shipping. If we integrate shipping into Stripe Checkout, we might skip this endpoint. However, offering it gives us flexibility (for example, we could present shipping options in our own UI before redirecting to Stripe and include the chosen one's cost in the Checkout Session as a line item).

- `POST /shipping/webhook` – If using Shippo's webhooks for tracking, we could have this to update order status when a package is delivered, etc. This is optional and likely not needed initially.

#### Admin APIs (for future or internal use)

Possibly, if the site owner wants to create or update content through our backend instead of directly in CMS, we could have admin-protected routes to do so. But since Sanity has its own studio, we probably won't replicate that. We may have an `GET /admin/orders` to list all orders (for the admin to see sales) or an `PATCH /orders/:id/ship` to mark as shipped if we ever needed manual intervention. But much can be automated.

#### API Standards and Validation

Each endpoint will be documented and follow typical HTTP semantics (e.g., appropriate status codes, input validation with clear error messages). We will employ NestJS pipes for validation (using class-validator on DTOs) to ensure, for instance, that the shipping country code is a valid two-letter code, or the artwork slug is a non-empty string, etc., returning 400 Bad Request if not. Errors like trying to purchase an already sold artwork will result in a 409 Conflict with a message like "Artwork is no longer available."

#### Concurrency Safety

For concurrency safety – the scenario of two people attempting to buy the same artwork – our backend when creating orders will perform a check and set within a transaction if using a DB flag. For example, if we keep an Artwork table with an `isSold` flag, we would run an update like `WHERE id= X and isSold=false` to set it true, and check if any row was updated. If 0 rows updated, it means it was already sold (or concurrently sold), so we abort. If using only the Orders table to infer sold status, we could set a unique constraint on `artworkId` in Order where status != canceled, then when inserting a new OrderItem it will fail if that `artworkId` already exists in an order. We'll account for this in code to give a graceful message to the user.

## Integration with External Services

### Stripe Integration

We will use Stripe's official Node library. We'll configure it with our secret key via environment variable. The PaymentsService class will encapsulate calls such as `stripe.checkout.sessions.create({...})` to create a session[13], and perhaps `stripe.refunds.create()` if we ever need to automate refunds. We'll also use the Stripe library in the webhook to retrieve the event data safely (it can parse and verify the webhook signature given the raw body and our endpoint secret). All Stripe-related operations will be restricted to the backend for security.

#### Multi-Currency Support

One important aspect is handling currencies: We will define prices in the CMS likely in one base currency (say GBP if the artist is UK-based). But we want to support USD as well. We have options:

- **Dual Pricing**: store both GBP and USD prices for each artwork in the CMS (the artist can set a price for each market). This is likely the best approach so that each price is a round, intentional number rather than a conversion. The CMS schema can have fields `priceGBP` and `priceUSD`. When the frontend requests artwork data, it can get both and display based on user choice. When creating the Stripe session, we send the amount in the chosen currency. Stripe will charge in that currency and deposit to our account. We'll have a Stripe account configured to accept both (having a USD balance and a GBP balance). According to Stripe docs, if we have multiple accounts (GBP default and a USD one), a non-default currency charge will either auto-convert to default or deposit in the matching currency account[4]. We'll ensure our Stripe account supports both GBP and USD (likely by adding a USD bank account in Stripe).

- **On-the-fly conversion**: Alternatively, we could on backend query an FX rate API to convert GBP price to USD or vice-versa at checkout time. This is less ideal for an art store because prices can fluctuate with currency and we probably prefer stable set prices. So we prefer the dual pricing method.

We will also format amounts properly for Stripe (they expect integer cents for USD, pence for GBP). E.g., an artwork priced £500 will be sent as `amount=50000, currency='GBP'`. For $600, `amount=60000, currency='USD'`. We'll be careful about the smallest currency unit differences (Stripe's API uses smallest currency unit integers).

### Google OAuth

On NestJS, implementing Google OAuth uses the Passport strategy as noted. We'll register the GoogleStrategy provider with our client ID/secret and use scopes `['profile', 'email']`. We will handle the callback as described. Since Google OAuth is a well-trodden path, we can follow the official NestJS documentation or community articles[14] which show how to plug it in. We'll also make sure to handle errors (if a user denies consent, or if Google returns an error, we should not crash – instead redirect to login page with an error message).

### Shippo/EasyPost Integration

We will choose one (say Shippo for now). Shippo has a Node client library[15]. In our ShippingService, we will initialize the Shippo API with our secret token. To get rates, we need to create "shipment" objects: we will have a predefined origin address (the studio/warehouse from where art ships) and use the user's provided address as destination, plus a parcel object (dimensions & weight). We can store weight and dimensions in the CMS for each artwork (because a large canvas vs a small one differ – for now maybe assume a standard package or ask the artist to input weight/dims in CMS fields). After creating a Shipment via Shippo's API, we get various shipping rates. We will likely filter or choose a subset to show. The rates have attributes like service level (e.g. "USPS Priority Mail, 2-day") and cost. We might convert them to our site's currency if needed (if we charge in currency that is different – but ideally, if user is paying in USD, we fetch rates in USD as well or convert on the fly). Shippo usually returns all rates in a single currency (often USD by default). If we need local currency rates for UK, we might need separate logic or just show in the currency we charge.

When an order is paid, we use Shippo to purchase the label for the chosen rate. That returns a label URL (PDF or PNG) and a tracking number. We'll save the tracking number and maybe the label URL in the Order record. We won't necessarily expose the label to the user (the admin will use it to ship), but we could show the tracking number to the user on their order status page so they can track it. Shippo's API also can send email notifications to the customer if we want, but we can handle notifications ourselves.

One thing to note: using Shippo costs per label (they charge a small fee or take a cut on rates), but since it's small scale art store, this is fine. If not, EasyPost is similar in concept. Both simplify multi-carrier integration[5], which is beneficial if we sell internationally.

## Security, Performance, and DevOps

### Security Practices

The backend will enforce secure practices such as:

- Sanitizing and validating all inputs (to prevent SQL injection, though an ORM helps with that, and to provide meaningful errors to clients)
- Using HTTPS everywhere (the GCP load balancer or Cloud Run will ensure TLS)
- Enabling CORS on the API to allow our frontend domain to call it, but blocking other origins
- Storing secrets (Stripe keys, OAuth secrets, database password) only in env vars or secret manager, never in code repository
- Logging important events (logins, errors, payment webhook outcomes) for auditing. Possibly integrate with GCP's logging or an external service

### Performance Optimization

For performance, aside from the caching mentioned for CMS data, we might also implement server-side caching of certain GET requests. NestJS can use in-memory caching or a Redis if warranted. Given the number of artworks is not huge for an art site (maybe dozens or hundreds, not tens of thousands), simple in-memory caching of the artwork list for, say, 60 seconds could dramatically reduce CMS calls while still reflecting updates in a timely manner. We will also ensure database queries are optimized (proper indices on userId for orders, etc.). The database size is small here, so performance issues are more likely on the CMS or external API side or heavy 3D on frontend rather than the backend processing.

### Containerization and Deployment

We will containerize the NestJS app with a lightweight Node image. The Dockerfile will use a multi-stage build: one stage to compile TypeScript to JavaScript (running `npm run build` which outputs to `dist/`), then a final stage from `node:18-alpine` to copy the dist and run `node dist/main.js`. We will also include a health check endpoint (NestJS by default can respond on `/health` if we add a HealthModule, or we simply use root route) for Cloud Run to verify the container is running.

For deployment, we'll use either GitHub Actions or Cloud Build triggers to automatically build and deploy the containers on git pushes. We will have separate environments perhaps (dev/staging/prod) using different GCP projects or service names. Cloud Run will scale the backend as needed (and we can set concurrency setting to allow multiple requests per instance since NestJS can handle it, perhaps `concurrency=80` which is default). The frontend static files if on Cloud Storage will be behind a CDN for global distribution and we might configure a short cache for HTML (since SPA HTML is mostly just a shell) and longer for JS assets.

## CMS Schema and Content Management

Using a headless CMS like Sanity gives us flexibility to manage the site's content without redeploying code. We will define a content schema in Sanity that covers the types of content needed:

### Content Types

#### Artwork (one document per piece of art for sale)

Fields likely include:

- `title` (String) – Name of the artwork
- `description` (Text/Block content) – A description or story behind the piece
- `images` (Array of Image) – One or more images of the artwork. Typically one main image and perhaps detail shots. Each image can have an alt text field for accessibility[16]
- `slug` (Slug) – A URL-friendly identifier (generated from title)[17]. This will be used for the artwork detail page route
- `priceGBP` (Number) – Price in GBP[18]
- `priceUSD` (Number) – Price in USD
- `currency` (maybe an option if we only store one price and a currency, but we prefer separate fields as above)
- `isSold` (Boolean) – Indicates if the piece has been sold. Initially false. After an order, we can set this to true via Sanity's API or manually in the studio to hide or mark the item
- `drop` (Reference to Drop) – Optional. This links the artwork to a "Drop" (collection) it belongs to
- `artist` (Reference to Artist) – Optional, if multiple artists; or a simple string if always one artist but you want to attribute. Since this is a single-artist store (presumably), we might not need an Artist type and can just have a single bio page

#### Drop (to represent a collection or release event)

Fields:

- `name` (String) – e.g. "Summer 2025 Collection"
- `releaseDate` (Date) – when it was/will be released (could be used to schedule publishing on site)
- `description` (Text) – optional description of the drop theme
- `artworks` (Array of Reference to Artwork) – the pieces in this drop. We might not need to store this both ways (if each artwork references a drop, Sanity can query reverse). But having it can be convenient for the CMS editor to see all in the drop

#### ArtistBio (for the about page)

Fields:

- `title` – (String, e.g. "About the Artist")
- `content` – (Rich Text) the biography text, which can include styled text, maybe images
- `portrait` – (Image) a photo of the artist or a representative graphic

This could be a singleton document (Sanity often uses a pattern of a single instance document for such pages, or we can just query by type if there's only one).

#### Site Settings (optional)

We could have a document for global settings like supported currencies (though we know it's GBP & USD fixed), site-wide banner announcements (like "New drop coming on X date"), or contact info, social media links, etc. This is not strictly necessary but can be handy to avoid hardcoding such info.

### Schema Implementation

These schemas will be defined in Sanity Studio (which can be a separate project or integrated to our repo). For example, a simplified Sanity schema for Artwork in code might look like the one from a similar e-commerce tutorial[19][18], tailored to our needs:

```javascript
// schemas/artwork.js (Sanity schema)
export default defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: Rule => Rule.required() },
    { name: 'images', title: 'Images', type: 'array', of: [{ type: 'image', fields: [{name: 'alt', type: 'string', title: 'Alt Text'}] }] },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'priceGBP', title: 'Price (GBP)', type: 'number', validation: Rule => Rule.required().positive() },
    { name: 'priceUSD', title: 'Price (USD)', type: 'number', validation: Rule => Rule.required().positive() },
    { name: 'isSold', title: 'Sold?', type: 'boolean', initialValue: false },
    { name: 'drop', title: 'Drop', type: 'reference', to: [{ type: 'drop' }] }
    // possibly other fields like dimensions, medium, year, etc. if needed
  ]
});
```

And similarly define drop, artistBio, etc. The CMS will greatly ease content updates. For example, when the artist has a new series of paintings to sell, they can go into Sanity Studio (a nice UI) and create new Artwork entries, maybe group them under a new Drop, and mark them as available. These will instantly reflect on the site via our API calls. If an artwork sells, our backend can update the `isSold` field by sending a Sanity mutation (Sanity provides a HTTP PATCH endpoint to set fields by document ID). Alternatively, the site admin can manually mark items as sold in the CMS after getting a notification that an order completed (though that's extra work; automation is preferable).

### Data Querying

The frontend will query the CMS data either through our backend or directly using Sanity's client. If through backend, an example implementation is: the ProductsService uses Sanity's JavaScript client with a GROQ query like:

```groq
*[_type == "artwork" && isSold != true]{
   _id, title, slug, description, priceGBP, priceUSD, "imageUrl": images[0].asset->url, drop->{name}
}
```

to fetch all unsold artworks and their main image URL[20]. The backend would then return that JSON to React. For a single artwork, similar query filtering by slug. Using GROQ allows retrieving references (the `drop->{name}` syntax populates the drop's name by joining on reference).

If we go direct from frontend, we would use Sanity's client in the React app and perhaps call the same queries. However, then we'd need to expose a read token or make the dataset public (readable). Sanity can allow public read if we don't have sensitive data in it (which we don't, just art info). Public read is probably fine here, meaning the React app can query without auth. But for simplicity and control (especially to merge sold status), I lean towards routing through the backend.

### Deployment and Publishing

We'll deploy the Sanity Studio either on Sanity's hosted service or as a separate project (e.g. on Vercel). The content backend (Sanity's data store) is cloud-hosted by Sanity.

Using a CMS also means we should think about draft vs published. For an e-commerce site, we likely treat the published documents as the live data. The artist can prepare new items as drafts and publish them when ready for a drop. Our queries should probably fetch only published items (which is the default unless using preview tokens).

One more content piece is perhaps a Homepage content or Banner that the artist can control – e.g. a welcome message or highlight of a current collection. This can be another simple document type or part of Site Settings.

In summary, the CMS gives us a scalable, editor-friendly way to manage products. It decouples content from code. And because Sanity is headless, we are free to query the data in any way. It's also real-time – if we open a preview site with Sanity hooks, we could live update content, but that's not essential.

## Deployment on Google Cloud

Deploying on GCP will ensure our application is highly available and can scale. Here are the deployment considerations and steps for each part:

### NestJS Backend Deployment

We will deploy the NestJS API as a Docker container on Google Cloud Run. Cloud Run is a fully managed serverless platform where containers scale out automatically based on traffic, and scale to zero when not in use (which could save costs in low-traffic scenarios). 

Steps:

1. We create a Docker image for the backend. Ensure the container listens on the port that Cloud Run provides (by default Nest listens on 3000, but Cloud Run will route `$PORT` env var; we'll adjust our `main.ts` to use `process.env.PORT` if set).

2. Push the image to Google Container Registry (GCR) or Artifact Registry.

3. Deploy to Cloud Run with appropriate settings: allow unauthenticated invocations (since this is a public API), set environment variables (we'll add the needed env vars like `STRIPE_SECRET`, `GOOGLE_OAUTH_CLIENT_ID`, etc. via the Cloud Run console or using `gcloud run deploy` with `--set-secrets` flags linking to Secret Manager). We'll allocate maybe 0.5 vCPU and 512MB RAM as a start, with auto-scaling up to say 5 or 10 instances on demand (we can adjust based on expected traffic).

4. Set concurrency to a reasonable level (NestJS can handle many requests concurrently; we might set `concurrency=80` which means one container can handle 80 requests in parallel, leveraging Node's async nature – this often reduces the need to scale out too quickly and is cost-effective).

5. We'll also set up a custom domain mapping for the Cloud Run URL (Cloud Run gives a default `.run.app` URL, but we want `api.exampleart.com`). Alternatively, we might use a GCP Load Balancer to route `api.exampleart.com` to the Cloud Run service, especially if we have multiple services (like one for frontend if using SSR, but we probably don't).

6. Logging and monitoring: Cloud Run automatically streams logs to Stackdriver (Cloud Logging). We can view logs by container instance which helps debug. We'll also set up alerts if the error rate goes above a threshold or CPU stays high consistently.

### React Frontend Deployment

Since the React app is a static SPA, the optimal way is to build it and serve it via a CDN. Options:

- **Use Google Cloud Storage (GCS)** to host static files. We create a bucket (possibly a website-configured bucket) and upload the build output (index.html, bundle.js, css, assets). Then either use that bucket's public URL or, more professionally, put a Cloud CDN in front to cache the content globally and link it to a custom domain (www.exampleart.com). Cloud CDN with a backend bucket will serve the files quickly to users in UK, US, etc. We need to configure caching headers on the files (the build usually outputs hashed filenames for JS/CSS which can be cached long-term, and index.html can be cached for short but not too long since it's the entry).

- **Alternatively, use Firebase Hosting** (which under the hood uses Google's CDN) – it's very straightforward for SPAs and supports custom domains + SSL. Since the user specifically said Google Cloud, we might stick to GCS+CDN or deploy the static files via Cloud Run as well.

- **Another approach**: serve the static files from the same Cloud Run as the NestJS app (Nest can be set to serve frontend build from a public folder). However, separating concerns is cleaner and Cloud Run's CDN isn't as straightforward as using a dedicated static host. We likely separate them: Cloud Run for API, Cloud Storage (with CDN) for frontend.

### Domain Configuration

We will point our domain's DNS to the appropriate endpoints: e.g., use Cloud DNS or our domain provider's DNS to map the root/apex and subdomains. Possibly:

- `exampleart.com` and `www.exampleart.com` -> point to the static site (Cloud CDN or Firebase)
- `api.exampleart.com` -> points to Cloud Run backend. (Cloud Run gives a unique subdomain we can CNAME to, or using load balancer, etc. There's a feature to map custom domain to Cloud Run service directly via verification steps)

Environment-specific config (like API base URL) for the frontend will be handled at build time or using some runtime config injection. Typically, we can set a variable in the React app to call the proper API domain.

### Database Deployment

**Google Cloud SQL (PostgreSQL)**: We will likely use Cloud SQL to host our Postgres database. It's a managed DB service. We'll create a Postgres instance, set a strong password, and apply any needed IP authorized networks or use Cloud Run's VPC connector to connect privately. Another easier method: use a hosted database like Supabase or PlanetScale, but to keep in GCP, Cloud SQL is fine. We must be mindful of connections; using a connection pooler or PGbouncer for serverless is recommended since Cloud Run could scale many instances and each might open some connections. Alternatively, use Prisma Data Proxy or similar if needed. For our scale, we might be okay without special measures, but it's something to monitor (max connections on basic Cloud SQL might be ~100, which should suffice initially).

We will also set up Secret Manager entries for secrets (Stripe, etc.), and during Cloud Run deploy link them. This ensures secrets aren't in code or Docker image.

### CI/CD Pipeline

We can configure a GitHub Action or use Google Cloud Build triggers for CI. On push to main or a release branch, run tests, then build Docker and deploy. Similarly, for the frontend, run `npm run build` and then deploy files to the bucket (there are GitHub actions for GCS upload or Firebase deploy). This automation will help us deploy updates quickly.

### Domain and SSL

We'll obtain an SSL certificate via either Cloud Run's built-in cert provisioning or using Let's Encrypt through Firebase/Cloud CDN. For instance, if using Firebase Hosting for static, it auto provisions SSL for the domain. If using Cloud CDN, we can provision a managed SSL cert for our domain. End result: users accessing the site or API will always be on `https://`.

### Scaling Considerations

The site likely won't have enormous traffic (art drops might spike interest though). Cloud Run can scale the backend from 0 to N instances within seconds based on request volume, and Cloud CDN will handle static spikes easily by caching. We'll set upper limits if necessary to control cost (e.g., max 10 instances, can be adjusted). We should also ensure to handle Stripe webhooks even when no instances are running (Cloud Run will spin up an instance on demand for the webhook – this could take a second or two, but Stripe webhooks tolerate some retry if first attempt times out).

### Monitoring and Logging

We will use Cloud Monitoring dashboards to watch metrics like CPU, memory, request count, response latency on Cloud Run. Also set up uptime checks (a periodic ping to the site or a health endpoint) and alerts if it goes down. Sentry or a similar service can be integrated in both front and back for error tracking.

With this deployment setup, the application will be robust: even if we have a flash sale with many users, Cloud Run will spawn more instances to handle API traffic, and the static content being on CDN means it won't overload our origin.

Deployment on GCP also makes future expansion easy: if we later separate services (like a separate microservice for some heavy image processing or add Cloud Functions for certain tasks), we can integrate those in the same environment. We can also take advantage of GCP's other services like Cloud Storage for user uploads (if we allow users to upload something someday), or use Firebase for notifications, etc., due to being in the same ecosystem.

## Accessibility and Responsive Design Considerations

While focusing on a psychedelic 3D experience, we must not neglect accessibility (a11y) and broad device compatibility. We will adhere to Web Content Accessibility Guidelines (WCAG) as much as possible, ensuring the site is usable by people with disabilities and on all common devices.

### Key Accessibility Strategies

- **Semantic HTML**: Use appropriate elements (e.g., `<header>`, `<nav>`, `<main>`, `<footer>` for layout, and `<h1>`…`<h2>` for headings hierarchy) so that assistive technologies can parse the page structure. Important interactive elements like buttons (e.g., "Buy" button) and links will use proper `<button>` or `<a>` tags, not just clickable `<div>`s, to ensure keyboard and screen reader accessibility.

- **Alt Text on Images**: All images of artworks will have descriptive alternative text. The CMS schema includes an alt text field for each image[21], and the content editor (artist) will be instructed to fill these with meaningful descriptions (e.g. "Oil painting of a surreal landscape with melting clocks"). This way, visually impaired users using screen readers know what each artwork depicts. Decorative images or background patterns can have empty alt (`alt=""`) or be set via CSS so as not to clutter screen reader output.

- **Keyboard Navigation**: The site will be fully navigable via keyboard alone. We'll ensure that all interactive controls (menus, links, cart icon, etc.) receive focus in a logical order. For any custom components (like a 3D canvas area), we'll manage focus by possibly providing a skip link or making certain overlays focusable. If the gallery is a series of items, using proper HTML list or grid semantics with focus on each item (maybe the item has a transparent link or button that covers it) can allow users to tab through artworks and hit Enter to view details. The `react-three-a11y` library can be employed to make 3D objects focusable and provide ARIA labels[22] – for example, wrapping a Three.js mesh with their a11y component to treat it as a button for screen readers.

- **Color and Contrast**: Psychedelic design often uses bright colors, but we must ensure sufficient contrast for text. We will choose color combinations that meet at least WCAG AA contrast ratio for text against backgrounds. For instance, if we have neon text, it might be on a dark background to contrast. We'll test with tools or even use frameworks like Chakra or Material's theming which have accessible default palettes, adjusting to our scheme. Additionally, we'll avoid color alone to convey information (for users with color blindness), e.g., if we highlight an artwork as new in a bright color, also include an icon or label "New".

- **Motion and Animations**: Excessive motion can be problematic (causing dizziness or distraction) and some users prefer to reduce motion. We will respect the user's `prefers-reduced-motion` setting via CSS/JS. If that is set, we will either disable or simplify animations (for example, we might not auto-rotate backgrounds or we reduce parallax effects). Additionally, any flashing content must not flash faster than the safe threshold to avoid seizure triggers – generally avoid intense flashes altogether.

- **Screen Reader Announcements**: For dynamic actions like adding to cart or after checkout redirect, we can use ARIA live regions to inform screen reader users. E.g., when an item is added to cart, update an ARIA-live element with "Added [Artwork Title] to cart". On page navigations (since SPA doesn't do full page refresh), we'll programmatically manage focus – e.g., when navigating to a new page route, set focus to the top heading or the main container, and update the page title, so screen reader knows a new "page" loaded.

- **Accessible 3D/Canvas**: WebGL canvas content is not directly accessible to screen readers because it's essentially a bitmap with no inherent structure[23]. To handle this, we will provide alternative content and controls:
  - Ensure important info presented in the 3D scene is also available as text. For example, if the 3D gallery shows titles of artworks on hover only, we should have those titles in the DOM as well (perhaps hidden offscreen for screen readers or as overlay text).
  - Use the library `react-three-a11y` which can assign ARIA roles to Three.js objects. This can allow, for instance, a 3D object representing an artwork to have an ARIA label like "Artwork: [Title], Price $X, press Enter for details" and be focusable[22]. It basically ties into the HTML accessibility tree even though it's rendering WebGL.
  - Provide keyboard alternatives for any primarily mouse-driven interactions. If the gallery can be scrolled or panned with mouse drag, ensure arrow keys or tabbing through items accomplishes the same.
  - If certain visual effects are purely decorative (like swirling backgrounds), we mark them in a way to be ignored by assistive tech (e.g., `aria-hidden` on the canvas if it carries no info). But if it's interactive art content, we ensure a description. Possibly have a hidden description like "Background animation of colorful fluid shapes" to give context.

### Responsive Design for Mobile

We will design layouts that adapt gracefully to various screen sizes. Using a mobile-first CSS approach ensures functionality on small screens:

- Navigation will likely collapse into a hamburger menu on mobile. We must make that menu accessible: the button should have `aria-label="Open menu"`, focus management (focus moves into the menu when opened and returns to menu button when closed), and the menu items should be keyboard navigable.

- The 3D features on mobile may be scaled down – e.g., fewer objects or simpler effects to maintain performance. We'll test on actual devices to ensure it's still smooth. Possibly disabling heavy shaders on older phones.

- Touch controls: ensure that any hover effects also work with touch (maybe triggered on tap). If we use drag for 3D navigation, allow swipe gestures similarly. Use adequate touch target sizes (buttons at least ~48px in size as per guidelines).

- Use CSS flex or grid to reorder elements if needed on smaller screens (for example, image above text on mobile vs side-by-side on desktop).

- We will also consider safe area insets for newer phones (account for notches, etc., via CSS env variables).

### Testing Accessibility

We will conduct accessibility testing using tools like axe (there's axe-core integration, or Lighthouse audits) and by manually testing with a screen reader (VoiceOver/NVDA) and keyboard navigation. We aim for at least WCAG 2.1 AA compliance. We will write up an Accessibility Statement on the site acknowledging any known gaps and our commitment to improve[24].

By incorporating these practices, we ensure that the site is not only flashy and modern but also inclusive. This expands our audience (people who use assistive tech, or simply people on low-power devices or with poor eyesight, etc.) and also improves overall UX (often, improvements like clearer contrast and focus indicators benefit everyone).

In the context of a psychedelic art site, being accessible might seem challenging, but it's absolutely doable – for example, we can allow users to turn off certain background animations (perhaps a "reduce motion" toggle in case the system setting isn't enough)[25]. Also, ensuring content is perceivable in multiple ways aligns with the idea of multi-sensory design often discussed in inclusive design principles[25] – e.g., providing descriptive audio or text for visual elements (maybe in the future we could even have an audio narration of the art description for those who prefer listening).

In summary, accessibility will be treated as a first-class requirement, not an afterthought, even as we push creative boundaries with the design.

## Future Expansion and Scalability

The initial implementation focuses on original physical artworks, but we have an eye on the future for expanding features and product offerings. Here are some possible future enhancements and how our design can accommodate them:

### Digital Downloads & Virtual Products

We may want to sell digital goods such as downloadable art prints, music, or digital art files. Our architecture can support this by introducing a new product type. In the CMS, we could add a field or a new schema for "DigitalProduct" which might have a file attachment or a link. The backend would need to handle delivering the file – perhaps generate a secure download link after purchase (maybe using GCP Cloud Storage signed URLs or a service like Firebase Storage with security rules). Because our payment and order system already exists, selling a digital item is mainly a matter of skipping shipping. We would adjust the Order logic to not require a shipping address or label for digital items. We could also integrate license generation (for example, if selling software or generative art, maybe each purchase generates a unique license code). Our current database can store a type or flag for order items that are digital, and maybe a field for the download URL or license key. On the frontend, after payment, if it's a digital item, we could present a download link immediately on the confirmation page or email it. Security: ensure downloads are protected (only purchaser can access, maybe via a one-time token link or requiring login). Our use of Stripe doesn't change for digital vs physical except we'd disable shipping collection for digital-only purchases.

### Limited Editions and Variants

In the art world, there might be limited edition prints or multiple sizes of a print. This introduces the concept of variants (multiple units of essentially the same base artwork). Our current system is one-of-a-kind only, but we can extend it. If we plan to support editions, we could adjust the CMS model: e.g., an Artwork could have a field "editionSize" and "editionsAvailable" count. Or treat each edition as a separate Artwork entry with a common reference. However, a better approach might be to create a separate schema for Edition or utilize the variant concept. For example:

- **Edition**: fields like `parentArtwork` (reference), `editionNumber`, maybe a separate price (if all editions same price this might not be needed except for special numbers). Or simpler, just store quantity available.

The backend could then allow quantity >1 for those items. For purchase, we would decrement the quantity until 0, then mark as sold out. Our DB and logic would need slight modifications: allow an OrderItem to have quantity >1 (rarely would someone buy more than one of the same piece though, unless they are buying multiple prints of same piece – not typical for art prints; usually limit 1 per customer for limited art prints). We might need an Inventory service or just incorporate it into Product. We should also ensure no overselling: similar to our one-of-a-kind logic, but extended to stock counts. We could lock a row for update or use inventory = inventory - X where inventory >= X SQL update to atomically reduce stock. In NestJS structure, we could then unify one-of-a-kind and limited prints by having maybe a field maxQuantity on Artwork. If maxQuantity=1 it's unique; if >1 it's an edition. The UI would then possibly show a dropdown to select quantity (which we currently hide for unique items). So our design needs to be flexible to allow that. Fortunately, because we decoupled content, the CMS can be updated to add those fields and our API can start providing them. We may also include variant attributes like different sizes or formats. Possibly treat those as separate products for simplicity, or use a nested structure (like Artwork -> children variant products with their own price, stock). If we foresee that, we might just keep it straightforward by listing each variant as its own entry in CMS (like "Painting XYZ – Small Print" vs "Painting XYZ – Large Print"), or implement in a similar way to the typical product & variant tables (like how the example e-commerce DB had a Product and ProductVariant table[26]).

#### 4.2.2. Licensing and Commissioning

Perhaps the site could allow purchasing a license to use an artwork (for example, in a commercial project) or even commission new art.

- **For licensing**, this might not be a typical e-commerce flow with a cart; it might be more of a form where user requests usage and gets a quote. But we could also have preset license products (like "License for personal use – $X"). We could integrate a form or have digital products that represent licenses. If we wanted to automate it, perhaps using a service or just a PDF generation that includes the license terms and buyer info. This could be delivered similar to digital download.

- **For commissions**, likely it would involve a contact form rather than direct purchase (complex pricing). But if in future we wanted an order pipeline for commissions, we might incorporate an "order request" with status that an admin can price and send invoice via Stripe. Our use of Stripe can extend to Stripe Invoices or PaymentIntents which we create on the fly for custom amounts.

#### 4.2.3. Multiple Artists / Marketplace

While currently it seems a single artist site, in future, they might bring in other artists or turn it into a curated marketplace for psychedelic art. Our structure can accommodate multiple artists by:

- Adding an Artist model (in CMS and maybe in DB if needed). Each Artwork would reference an Artist.
- The frontend could have artist pages, etc. This doesn't break anything fundamental – mostly additional relationships and filtering (like view art by artist).
- Auth might be extended to have artist accounts to upload their work, which means building out more complex multi-user CMS or an admin interface. Possibly integrate a role-based system where some users can access certain admin endpoints. NestJS can handle roles via guards easily (we have role field in User). But enabling user-generated content adds complexity like moderation, etc. For now, just acknowledging that we can scale to more artists by using the CMS and maybe adding admin interfaces.

#### 4.2.4. Internationalization (i18n)

If expanding beyond English or beyond UK/US markets, we'd consider multi-language support. Our CMS (Sanity) can support localized fields or separate datasets for translations. We might integrate something like i18next in the frontend. This is just something to note; the question did specify GBP and USD which suggests at least multi-currency, but not necessarily multi-language content. If needed, NestJS also has i18n modules for serving content in different languages. Our design doesn't preclude adding that later, but it would be a moderate effort.

#### 4.2.5. Mobile App

If in future a native mobile app is desired, our backend can serve as the API for it. We might adjust authentication (perhaps using OAuth tokens in a mobile context or integrate with Firebase Auth for simplicity in app). But since we have a decoupled backend with clear endpoints, building a React Native or Flutter app that talks to the same API is feasible. Also, since we used NestJS, converting or adding a GraphQL endpoint could be considered if that better serves a mobile app's needs (though REST is fine too).

#### 4.2.6. Scalability

As the business grows, more traffic or more products might require scaling up resources. Our architecture on GCP is already scalable. If we needed to handle extremely high loads or more complex processing:

- We could introduce caching layers like a CDN for the API (or at least caching GET /artworks) and a Redis cache for frequent reads.
- We could break out microservices (e.g., one service dedicated to running heavy 3D asset generation if we had that, or a separate service for handling webhooks and fulfillment in case we want to decouple it).
- Using a message queue or task queue for background processing (for example, sending emails or generating PDFs for licenses could be done asynchronously via Cloud Tasks or Pub/Sub). Right now, sending a confirmation email or shipping notification might be done inline after webhook, but ideally move to async to not delay response.
- Database scaling: Cloud SQL can be vertically scaled or use read replicas if needed. Or move to a more scalable DB if ever required, but unlikely in near term for this use-case.

#### 4.2.7. Additional Payment Methods

Stripe Checkout will automatically present Apple Pay, Google Pay, etc., if enabled, so that's already good. If needed, enabling PayPal or others might require separate integration, but Stripe covers a lot (including Afterpay/Clearpay, etc. in supported regions[27]). We could incorporate those easily by toggling in Stripe. If an artist wanted to accept crypto payments in future, Stripe even has some crypto on-ramp in 2023, or we could use other services.

#### 4.2.8. Community Features

Perhaps adding a blog or news section (CMS can handle blog posts), or user comments/reviews on artworks. That would require more backend logic (user content moderation). Our stack can handle it by adding a comments module, but we'd need to ensure spam control, etc. Not on immediate roadmap but possible.

#### 4.2.9. AR/VR Experience

Down the line, a truly immersive art experience might involve AR (Augmented Reality) to project art onto the user's environment, or VR gallery. With our Three.js foundation, we can explore WebXR (Three.js has WebXR support). This would be a frontend heavy addition, but our structured content and 3D focus sets the stage for it. We might allow, for instance, viewing an artwork in AR through the browser (using USDZ or glTF models of the art frame – if we have such assets). It's a stretch goal idea, but very fitting for immersive art.

### 4.3. Conclusion

The bottom line is our chosen architecture is extensible. The modular backend can accommodate new modules (e.g., adding a NewsletterModule for mailing list, or expanding the ProductsModule to handle different types of products). The frontend being component-based and using a CMS means adding new pages or features is not too disruptive. And using standard protocols (REST/JSON) means integration with other platforms (like a third-party marketplace or social media shops) is feasible if ever needed.

We have built a foundation that is maintainable and ready for growth. Future expansion will be guided by user demand and business direction, but we are confident that the system can evolve without requiring a complete rewrite. Each suggested future feature can be layered on with manageable incremental changes due to the separation of concerns and use of widely-adopted frameworks.

---

## 5. Sources

- Slaknoah, Seamless Payment Processing with Stripe and NestJS – Describes the synergy of NestJS with Stripe for structured, maintainable payment features[1].
- Tosin Moronfolu, Implement Google OAuth in NestJS using Passport – Guided the Google OAuth setup using NestJS and Passport's Google strategy[3].
- Enodi Audu, How to Build an E-commerce Store with Sanity and Next.js – Demonstrates using Sanity CMS to manage products for a headless e-commerce, with example schema for product, category, etc.[19][18].
- Muffin Group, An Awesome List of Trippy Websites – Showcases creative "trippy" web design inspirations, underlining the power of web tech to create psychedelic experiences[11] and examples like interactive fractal vines[10] and fluid simulations[28] that inform our 3D design strategy.
- Shippo Docs (GitHub) – Highlights that Shippo's API connects to multiple carriers and simplifies shipping workflows (rates, labels, tracking) via one integration[5], guiding our shipping integration plan.
- Nadim Chowdhury, Create full backend API with NestJS for eCommerce – Provided insight into structuring a NestJS e-commerce backend with modules (Auth, Products, Orders, Payments, etc.)[12] and considerations like multi-currency support[29].
- Stack Overflow – Example of specifying currency in Stripe Checkout, emphasizing handling multi-currency properly in integration (GBP vs USD)[7].
- Stripe Documentation – Notes on multi-currency and settlement (e.g., how charges in non-default currency convert for settlement) to ensure our multi-currency implementation aligns with Stripe's practices[4].
- Pip Lev, Three.js & Accessibility – Advice on making WebGL content accessible, e.g., using react-three-a11y to make 3D objects focusable and providing alternative descriptions[22], as well as general web accessibility tips for inclusive design (color contrast tools, multi-sensory feedback, etc.)[25][24].

---

## 6. References

[1] [6] [13] Seamless Payment Processing with Stripe and NestJS - DEV Community
https://dev.to/slaknoah/seamless-payment-processing-with-stripe-and-nestjs-3cbg

[2] [16] [17] [18] [19] [20] [21] How to Build an E-commerce Store with Sanity and Next.js - DEV Community
https://dev.to/enodi/how-to-build-an-e-commerce-store-with-sanity-and-nextjs-4099

[3] [14] Implement Google OAuth in NestJS using Passport - DEV Community
https://dev.to/chukwutosin_/implement-google-oauth-in-nestjs-using-passport-1j3k

[4] Supported currencies | Stripe Documentation
https://docs.stripe.com/currencies

[5] [15] GitHub - goshippo/shippo-node-client: Shipping API Node.js library (USPS, FedEx, UPS and more)
https://github.com/goshippo/shippo-node-client

[7] ruby on rails - Changing Stripe currency from default USD to GBP - Stack Overflow
https://stackoverflow.com/questions/35264836/changing-stripe-currency-from-default-usd-to-gbp

[8] [React Three Fiber] 3D gallery with scroll animation - Questions
https://discourse.threejs.org/t/react-three-fiber-3d-gallery-with-scroll-animation/21159

[9] Examples - React Three Fiber
https://r3f.docs.pmnd.rs/getting-started/examples

[10] [11] [28] An Awesome List of Trippy Websites You Should Check Out
https://muffingroup.com/blog/trippy-websites/

[12] [29] Create full backend API with Nest JS for eCommerce website - DEV Community
https://dev.to/nadim_ch0wdhury/create-full-backend-api-with-nest-js-for-ecommerce-website-59ae

[22] [23] [24] [25] Three.js & Accessibility. How do you approach accessibility when… | by Pip Lev | Medium
https://medium.com/@piplev/three-js-accessibility-c4f45d83f2c6

[26] Ecommerce DB diagram (Nest JS Ecommerce Series 01) | by Deepak Mandal | Dev Genius
https://blog.devgenius.io/ecommerce-db-diagram-nest-js-ecommerce-series-01-585b126fa3d8?gi=6785daa75bd4

[27] Payment method support | Stripe Documentation
https://docs.stripe.com/payments/payment-methods/payment-method-support
