# One-App

This is a comprehensive application built with Vue.js, designed to provide a seamless user experience.

## Features

- **User Authentication:** Secure login and registration functionalities.
- **Data Management:** Efficient handling and display of various data types.
- **Responsive Design:** Optimized for different screen sizes and devices.
- **Intuitive UI:** Clean and user-friendly interface for easy navigation.

## Technologies Used

- **Vue.js:** Progressive JavaScript framework for building user interfaces.
- **Vue Router:** Official routing library for Vue.js.
- **Vuex:** State management pattern + library for Vue.js applications.
- **Axios:** Promise-based HTTP client for making API requests.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.

## Installation

To get started with One-App, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/one-app.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd one-app
   ```

3. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

## Usage

To run the application in development mode:

```bash
npm run serve
# or
yarn serve
```

This will start a development server, and you can access the application in your browser at `http://localhost:8080`.

To build the application for production:

```bash
npm run build
# or
yarn build
```

This will compile and minify the application into the `dist` directory, ready for deployment.

## Project Structure

```
one-app
├─ index.html
├─ package.json
├─ public
│  ├─ app.png
│  ├─ image.png
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ App.vue
│  ├─ assets
│  │  └─ vue.svg
│  ├─ components
│  │  ├─ Navbar.vue
│  │  ├─ Sidebar.vue
│  │  ├─ tasks
│  │  │  ├─ TaskFilterBar.vue
│  │  │  ├─ TaskForm.vue
│  │  │  ├─ TaskItem.vue
│  │  │  └─ TaskList.vue
│  │  └─ ui
│  │     ├─ ConfirmDialog.vue
│  │     ├─ EmptyState.vue
│  │     └─ Modal.vue
│  ├─ layouts
│  │  └─ MainLayout.vue
│  ├─ main.ts
│  ├─ pages
│  │  ├─ auth
│  │  │  ├─ Login.vue
│  │  │  └─ Profile.vue
│  │  ├─ Home.vue
│  │  └─ tasks
│  │     ├─ TaskDetail.vue
│  │     ├─ TaskPage.vue
│  │     └─ TaskToday.vue
│  ├─ router
│  │  └─ index.ts
│  └─ style.css
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
└─ yarn.lock

```