import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authReducer, tokenRefreshed, logoutUser } from "../slice/authSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import api from "../api/api";

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// setup interceptor after store is created
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// In your Redux store setup file

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // An array of public routes to ignore for token refresh logic
    const publicEndpoints = ["/login", "/register"];

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      // This is the crucial check:
      !publicEndpoints.includes(originalRequest.url)
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await api.post(
          "/refresh",
          {},
          { withCredentials: true }
        );
        const newToken = refreshResponse.data.data.accessToken;
        store.dispatch(tokenRefreshed(newToken));
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        store.dispatch(logoutUser());
      }
    }
    return Promise.reject(error);
  }
);

export const persistor = persistStore(store);
export default store;
