import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

const initialState = {
  courses: [],
  myCourses: [],
  loading: false,
  error: null,
};

// PUBLIC COURSES
export const fetchCourses = createAsyncThunk(
  "course/fetchCourses",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/course/getAllCourses?page=${page}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch courses"
      );
    }
  }
);

// INSTRUCTOR COURSES
export const fetchInstructorCourses = createAsyncThunk(
  "course/fetchInstructorCourses",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/course/getInstructorCourses?page=${page}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch instructor courses"
      );
    }
  }
);

// STUDENT ENROLLED COURSES
export const fetchStudentEnrolledCourses = createAsyncThunk(
  "course/fetchStudentEnrolledCourses",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/course/getStudentCourses?page=${page}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch student enrolled courses"
      );
    }
  }
);

// slice
const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    clearCourses: (state) => {
      state.courses = [];
      state.error = null;
      state.loading = false;
    },
    clearMyCourses: (state) => {
      state.myCourses = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // PUBLIC COURSES
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        const { courses, page } = action.payload;

        state.loading = false;
        state.error = null;

        if (page === 1) {
          state.courses = courses; // replace
        } else {
          state.courses.push(...courses); // append
        }
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    /*  STUDENT COURSES  */
    builder
      .addCase(fetchStudentEnrolledCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentEnrolledCourses.fulfilled, (state, action) => {
        const { courses, page } = action.payload;

        state.loading = false;
        state.error = null;

        if (page === 1) {
          state.myCourses = courses;
        } else {
          state.myCourses.push(...courses);
        }
      })
      .addCase(fetchStudentEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // INSTRUCTOR COURSES
    builder
      .addCase(fetchInstructorCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstructorCourses.fulfilled, (state, action) => {
        const { courses, page } = action.payload;

        state.loading = false;
        state.error = null;

        if (page === 1) {
          state.myCourses = courses;
        } else {
          state.myCourses.push(...courses);
        }
      })
      .addCase(fetchInstructorCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCourses, clearMyCourses } = courseSlice.actions;
export const courseReducer = courseSlice.reducer;

// SELECTORS

export const selectCurrentCourses = (state) => state.course.courses;
export const selectCurrentMyCourses = (state) => state.course.myCourses;
export const selectCurrentLoading = (state) => state.course.loading;
export const selectCurrentError = (state) => state.course.error;
