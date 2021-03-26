import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

interface ITimer {
  id: string;
  title: string;
  startTime: number;
  status: string;
  error: string;
}

interface TimersState {
  timers: Array<ITimer>;
  status: string;
  error: string;
}

const initialState: TimersState = {
  timers: [],
  status: "idle",
  error: "",
};

export const fetchTimers = createAsyncThunk("timers/fetchTimers", async () => {
  let prom: Promise<Array<any>> = new Promise((res, rej) => {
    setTimeout(
      () =>
        res([]),
      1000
    );
  });

  let result = await prom;
  return result;
});

export const updateTimer = createAsyncThunk(
  "timers/updateTimer",
  async ({ id, title }: { id: string; title: string }) => {
    let prom = new Promise((res, rej) => {
      setTimeout(
        () =>
          res({
            id: id,
            title: title,
          }),
        1000
      );
    });

    let result = await prom;

    return result;
  }
);

export const createTimer = createAsyncThunk(
  "timers/createTimer",
  async ({ title }: { title: string }) => {
    let prom = new Promise((res, rej) => {
      setTimeout(
        () =>
          res({
            id: nanoid(5),
            title: title,
            startTime: Date.now(),
          }),
        1000
      );
    });

    let result = await prom;

    return result;
  }
);

export const deleteTimer = createAsyncThunk(
  "timers/deleteTimer",
  async (id: string) => {
    let prom = new Promise((res, rej) => {
      setTimeout(
        () =>
          res({
            id: id,
          }),
        1000
      );
    });

    let result = await prom;

    return result;
  }
);

export const timersSlice = createSlice({
  name: "timers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchTimers.fulfilled, (state, action) => {
        state.timers = action.payload.map((t: ITimer) => ({
          ...t,
          status: "idle",
          error: "",
        }));
        state.status = "completed";
      })
      .addCase(
        fetchTimers.rejected,
        (state, action: PayloadAction<any, any, any, any>) => {
          state.status = "failed";
          if (action.error) state.error = action.error.message;
        }
      )
      .addCase(
        updateTimer.fulfilled,
        (state, action: PayloadAction<any, any, any>) => {
          const { id, title } = action.payload;
          let timer = state.timers.find((timer) => timer.id === id);
          if (timer) {
            timer.title = title;
            timer.status = "completed";
          }
        }
      )
      .addCase(updateTimer.pending, (state, action) => {
        const { id } = action.meta.arg;

        let timer = state.timers.find((timer) => timer.id === id);
        if (timer) timer.status = "loading";
      })
      .addCase(
        updateTimer.rejected,
        (state, action: PayloadAction<any, any, any, any>) => {
          const { id } = action.meta.arg;
          let timer = state.timers.find((timer) => timer.id === id);
          if (timer) {
            timer.error = action.error.message;
            timer.status = "failed";
          }
        }
      )
      .addCase(deleteTimer.fulfilled, (state, action: PayloadAction<any>) => {
        const { id } = action.payload;
        // state.timers = state.timers.filter((timer) => timer.id !== id);
      })
      .addCase(deleteTimer.pending, (state, action) => {
        const id = action.meta.arg;
        state.timers = state.timers.filter((timer) => timer.id !== id);
      })
      .addCase(createTimer.fulfilled, (state, action: PayloadAction<any>) => {
        state.timers.push({ ...action.payload, status: "idle", error: "" });
      });
  },
});

export const selectTimers = (state: RootState) => state.timers.timers;

export default timersSlice.reducer;
