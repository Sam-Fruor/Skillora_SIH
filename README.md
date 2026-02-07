Skillora: The Ultimate Learning Playground 🚀 Skillora is a "Made in India" digital platform designed to revolutionize education by blending academic learning with creative play. Developed as a response to the "Swadeshi for Atmanirbhar Bharat - Toys & Games" challenge, it transforms complex subjects into engaging, interactive video games.

🌟 Features & Games Skillora features a diverse suite of games spanning multiple disciplines: ● 🧪 Alchemist's Treasure Hunt (Chemistry): A puzzle game to master the periodic table through drag-and-drop mechanics on a realistic map.

● ⚙️ Motor Works (Physics): A virtual workshop where users build a DC motor and watch a real-time 3D simulation of electromagnetic forces.

● 🏭 Industry Architect (Geography): A strategic resource management game set on a map of India to determine optimal industrial locations.

● 🧮 The Perfect Pour (Mathematics): A business simulation applying Mensuration, Arithmetic Progressions, and Quadratic Equations to run a shop.

● 🫀 Human Body Explorer (Biology): An interactive medical mystery game involving case files, diagnosis, and visual analysis.

🛠️ Tech Stack Frontend: ● Next.js 15 (React Framework) - Core application structure and routing.

● React 18 - Component-based UI architecture.

● Tailwind CSS - Utility-first styling for responsive design.

Interactivity & Graphics: ● @dnd-kit/core - Robust drag-and-drop primitives for 2D puzzles.

● HTML5 Canvas - Custom 2D physics simulations.

● react-icons - Providing UI icons.

Backend (BaaS): ● Google Firebase - Authentication, Firestore Database (NoSQL), and Hosting.

📋 Prerequisites Before running the project, ensure you have the following installed:

● Node.js (v18.0.0 or higher recommended)

● npm (Node Package Manager)

🚀 Installation & Setup Follow these steps to set up the project locally:

Clone the repository: 
```bash
git clone https://github.com/your-username/skillora.git 
cd skillora
```

Install Dependencies:
Run the following command to install all required packages listed in package.json: 
```bash
npm install
npm install three
```
Install Specific Libraries: If they were not automatically installed, ensure you have these key packages: 
```bash
npm install react-icons @dnd-kit/core firebase
```
Run the Development Server: Start the local server to view the application: 
```bash
npm run dev
```

Open in Browser: 
Visit  local host link generated  to see Skillora in action.

📦 Key Dependencies

The project relies on these primary packages:

next ---> latest --------> The React framework for the app.

react ---> latest --------> Core UI library.

@dnd-kit/core ---> latest --------> Handling drag-and-drop interactions.

react-icons ---> latest --------> Providing UI icons (Home, Restart, Tools).

firebase ---> latest --------> Backend services connection.

📁 Project Structure

● src/app/: Contains the main page routing logic (page.js, layout.js, globals.css).

● src/app/games/[id]/: Dynamic routing file for loading individual games.

● src/components/: Contains all self-contained game logic files (e.g., MotorWorksGame.js, PeriodicTableGame.js).

● src/data/: Stores static data arrays like elements or level definitions.

🤝 Contributing Contributions are welcome! Please fork the repository and submit a pull request for any new game modules or features. Skillora Team - Learning Made Fun.
