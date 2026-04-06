import React, { useState } from 'react';
import './FillTheBlank.css';
import { fillTheBlankData as questions } from '../../assets/fill_the_blank_data';

export const FillTheBlank = ({ onReturnToList, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([null, null]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showPopup, setShowPopup] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    // Helper to place chosen option into the next available blank
    const handleSelectOption = (option) => {
        if (isSubmitted) return;
        if (answers.includes(option)) return;

        const newAnswers = [...answers];
        const firstEmptyIndex = newAnswers.indexOf(null);
        if (firstEmptyIndex !== -1) {
            newAnswers[firstEmptyIndex] = option;
            setAnswers(newAnswers);
        }
    };

    // Helper to clear a blank when clicked
    const handleClearBlank = (index) => {
        if (isSubmitted) return;
        const newAnswers = [...answers];
        newAnswers[index] = null;
        setAnswers(newAnswers);
    };

    // Safe check in case we render before array exists
    const isCorrect = answers[0] === currentQuestion?.correctAnswers[0] && answers[1] === currentQuestion?.correctAnswers[1];

    const handleSubmit = () => {
        if (answers[0] && answers[1] && !isSubmitted) {
            setIsSubmitted(true);
            if (isCorrect) {
                setScore((prev) => prev + 1);
            }
            setShowPopup(true);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setAnswers([null, null]);
            setIsSubmitted(false);
            setShowPopup(false);
        } else {
            if (onComplete) onComplete();
            if (onReturnToList) onReturnToList();
        }
    };

    const handleRetry = () => {
        setAnswers([null, null]);
        setIsSubmitted(false);
        setShowPopup(false);
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setAnswers([null, null]);
        setIsSubmitted(false);
        setScore(0);
    };

    if (!currentQuestion) return null;

    return (
        <main className="app-frame ftb-frame">
            {/* Progress Bar Container */}
            <div className="ftb-progress-container">
                <div className="ftb-progress-track">
                    {questions.map((_, index) => {
                        const isActive = index <= currentQuestionIndex;
                        return (
                            <div key={index} className={`ftb-progress-step ${isActive ? 'active' : ''}`}>
                                <div className={`ftb-progress-icon ${isActive ? 'active' : ''}`}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Question Section */}
            <div className="ftb-content-area">
                <div className="ftb-question-text">
                    <div>{currentQuestion.part1}</div>
                    <div className="ftb-blank-container">
                        <button
                            onClick={() => handleClearBlank(0)}
                            className={`ftb-blank-btn ${isSubmitted ? (answers[0] === currentQuestion.correctAnswers[0] ? 'correct' : 'wrong') : ''}`}
                        >
                            {answers[0] || ""}
                        </button>
                        <span className="ftb-bold-text">{currentQuestion.part2}</span>
                        <button
                            onClick={() => handleClearBlank(1)}
                            className={`ftb-blank-btn ${isSubmitted ? (answers[1] === currentQuestion.correctAnswers[1] ? 'correct' : 'wrong') : ''}`}
                        >
                            {answers[1] || ""}
                        </button>
                    </div>
                    <div>{currentQuestion.part3}</div>
                </div>

                {/* Result message if submitted */}
                {isSubmitted && (
                    <div className="ftb-inline-result">
                        {isCorrect ? (
                            <span className="ftb-correct-text">정답입니다!</span>
                        ) : (
                            <div className="ftb-wrong-container">
                                <span className="ftb-wrong-text">오답입니다!</span>
                                <span className="ftb-answer-text">정답: {currentQuestion.correctAnswers[0]}, {currentQuestion.correctAnswers[1]}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Options Grid */}
                <div className="ftb-options-grid">
                    <div className="ftb-options-row">
                        <button
                            onClick={() => handleSelectOption(currentQuestion.options[0])}
                            disabled={answers.includes(currentQuestion.options[0]) || isSubmitted}
                            className="ftb-option-btn"
                        >
                            {currentQuestion.options[0]}
                        </button>
                        <button
                            onClick={() => handleSelectOption(currentQuestion.options[1])}
                            disabled={answers.includes(currentQuestion.options[1]) || isSubmitted}
                            className="ftb-option-btn"
                        >
                            {currentQuestion.options[1]}
                        </button>
                    </div>
                    <div className="ftb-options-row">
                        <button
                            onClick={() => handleSelectOption(currentQuestion.options[2])}
                            disabled={answers.includes(currentQuestion.options[2]) || isSubmitted}
                            className="ftb-option-btn"
                        >
                            {currentQuestion.options[2]}
                        </button>
                        <button
                            onClick={() => handleSelectOption(currentQuestion.options[3])}
                            disabled={answers.includes(currentQuestion.options[3]) || isSubmitted}
                            className="ftb-option-btn"
                        >
                            {currentQuestion.options[3]}
                        </button>
                    </div>
                    <div className="ftb-options-row">
                        <button
                            onClick={() => handleSelectOption(currentQuestion.options[4])}
                            disabled={answers.includes(currentQuestion.options[4]) || isSubmitted}
                            className="ftb-option-btn"
                        >
                            {currentQuestion.options[4]}
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="ftb-action-area">
                {!isSubmitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!answers[0] || !answers[1]}
                        className={`ftb-submit-btn ${(!answers[0] || !answers[1]) ? 'disabled' : ''}`}
                    >
                        정답 제출
                    </button>
                ) : (
                    <button onClick={handleNext} className="ftb-submit-btn">
                        {currentQuestionIndex < questions.length - 1 ? '다음 문제' : '목차로 이동'}
                    </button>
                )}
            </div>

            {/* Pop-up Overlay */}
            {showPopup && (
                <div className="ftb-popup-overlay">
                    <div className="ftb-popup-card">
                        <div className={`ftb-popup-icon ${isCorrect ? 'correct' : 'wrong'}`}>
                            {isCorrect ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>

                        <div className="ftb-popup-text">
                            <h2 className={`ftb-popup-title ${isCorrect ? 'correct' : 'wrong'}`}>
                                {isCorrect ? '정답입니다!' : '오답입니다!'}
                            </h2>
                            {!isCorrect && (
                                <p className="ftb-popup-answer">
                                    정답: <span>{currentQuestion.correctAnswers[0]}, {currentQuestion.correctAnswers[1]}</span>
                                </p>
                            )}
                        </div>

                        <button
                            onClick={isCorrect ? () => setShowPopup(false) : handleRetry}
                            className="ftb-main-btn"
                        >
                            {isCorrect ? '확인' : '다시 시도'}
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};
