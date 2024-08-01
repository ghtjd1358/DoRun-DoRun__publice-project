import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Question {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

interface QuizState {
    quizArray: Question[];
    quizStatus: string;
    quizError: string | null;
    currentQuestionIndex: number;
    userAnswers: string[];
}

const initialState: QuizState = {
    quizArray: [],
    quizStatus: 'idle',
    quizError: null,
    currentQuestionIndex: 0,
    userAnswers: [],
};

export const quizApi = createAsyncThunk('quiz/fetchQuiz',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://opentdb.com/api.php?amount=5&difficulty=easy&category=9&type=multiple`);
            return response.data.results;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(quizApi.pending, (state) => {
                state.quizStatus = 'loading';
            })
            .addCase(quizApi.fulfilled, (state, action) => {
                state.quizStatus = 'succeeded';
                state.quizArray = action.payload;
                state.currentQuestionIndex = 0;
                state.userAnswers = [];
            })
            .addCase(quizApi.rejected, (state, action) => {
                state.quizStatus = 'failed';
                state.quizError = action.payload;
            });
    }
});

export default quizSlice.reducer;
