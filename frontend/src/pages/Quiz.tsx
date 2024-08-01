import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { quizApi } from "../store/features/quiz";
import Spinner from "../components/Spinner";

export default function Quiz() {
    const dispatch = useDispatch();
    const {quizArray , quizStatus, quizError} = useSelector((state) => state.quiz);

    const [revealedAnswers, setRevealedAnswers] = useState<number[]>([]);

    useEffect(() => {
        dispatch(quizApi());
    }, [dispatch]);

    const handleAnswerClick = (index: number) => {
        if (!revealedAnswers.includes(index)) {
            setRevealedAnswers([...revealedAnswers, index]);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Quiz</h1>
            {quizStatus === 'loading' && <Spinner loadingText='잠시만 기다려주세요...' />}
            {quizStatus === 'failed' && <p className="text-red-500">Error: {quizError}</p>}
            {quizStatus === 'succeeded' && quizArray && quizArray.length > 0 && (
                <ul className="space-y-4">
                    {quizArray.map((quiz, index) => (
                        <li key={index} className="bg-white shadow-md p-4 rounded-md">
                            <p className="font-semibold mb-2">{quiz.question}</p>
                            <ul className="list-decimal list-inside">
                                {quiz.incorrect_answers.concat(quiz.correct_answer).map((answer, i) => (
                                    <li
                                        key={i}
                                        onClick={() => handleAnswerClick(index)}
                                        className="mt-1 cursor-pointer hover:underline"
                                    >
                                        {answer}
                                    </li>
                                ))}
                            </ul>
                            {revealedAnswers.includes(index) && (
                                <p className="mt-2 text-green-500">Correct answer: {quiz.correct_answer}</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
