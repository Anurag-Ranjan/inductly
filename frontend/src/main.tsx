import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store/store.ts";
import { router } from "./app/router/index.tsx";
import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import AuthInitializer from "./components/auth/AuthInitializer.tsx";

createRoot(document.getElementById("root")!).render(
	<Provider store={store}>
		<AuthInitializer />
		<RouterProvider router={router} />
		<ToastContainer />
	</Provider>,
);
