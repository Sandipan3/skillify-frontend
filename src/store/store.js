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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no token exists then never refresh
    const token = store.getState().auth.token;
    if (!token) {
      return Promise.reject(error);
    }

    //Prevent refresh on ANY /auth/* routes
    if (originalRequest.url.startsWith("/auth/")) {
      return Promise.reject(error);
    }

    //Handle expired token (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.data.accessToken;

        store.dispatch(tokenRefreshed(newToken));

        // retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        store.dispatch(logoutUser());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const persistor = persistStore(store);
export default store;
