# Extended Node Social App

Welcome to the Social Media NodeJS Server project! This is a server-side implementation of a social media application built using Node.js, Fastify, EJS, Prisma, Passport, and SQLite. The project focuses on server-side functionality, employing vanilla JavaScript for the frontend and BEM for styling. It is a rewrite and extension of [basic-express-social-app](https://github.com/kcoulsy/basic-express-social-app), while still having some limitations. The plan going forward will be to rewrite the whole project in Remix + Tailwind. So I've added tests to the services and utils so I can port those over without issues.

## Features

1. **Authentication**
   - Username and password user authentication using Passport.
   - Email functionality not set up so no forgot password or verification logic

2. **Post Management**
   - Users can create and publish posts.
   - Comments can be added to any post.

3. **Profile Interaction**
   - Users can post directly on someone else's profile.

4. **Social Connections**
   - Follow other users to keep up with their posts.

5. **Reactions**
   - Users can add reactions to any post.

## Tech Stack

- **Node.js**
  - Stuck with Node but will be using Bun on the next project
- **Fastify**
  - Didn't particularly like the DX of fastify. The ecosystem just doesn't compare to Express. The docs had lots of information but was hard to find. The typing was good but I didn't like the concept of creating plugins and registering them. I had issues splitting out the passport logic into a plugin, so the index.ts file just became a bit of a mess.
- **EJS:**
  - Used HBS in the last project so switched it up.
- **Prisma**
  - Good history using Prisma, I like the DX
- **Passport**
  - Was great with express, but the package for fastify was a bit more awkward to use
- **SQLite**
  - To keep it simple, avoid having to spin up a DB for this side project
- **Vitest**
  - Very similar to jest, but faster which I like

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/kcoulsy/extended-node-social-app.git
   cd extended-node-social-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the application in development mode:

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Production Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the application:

   ```bash
   npm run start
   ```

## Contributing

Contributions are welcome! If you'd like to contribute, please follow the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code as per the license terms.

Happy coding! 🚀