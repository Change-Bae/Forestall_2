import React, { useState, useRef } from 'react'
import './Quiz.css'
import { data } from '../../assets/data';

export const Quiz = ({ onReturnToList, onComplete }) => {

    let [index, setIndex] = useState(0);
    let [Question, setQuestion] = useState(data[index]);
    let [lock, setLock] = useState(false);
    let [score, setScore] = useState(0);
    let [result, setResult] = useState(false);
    let [showRetry, setShowRetry] = useState(false);
    let [selectedOption, setSelectedOption] = useState(null);
    let [isSubmitted, setIsSubmitted] = useState(false);
    let [showPopup, setShowPopup] = useState(false);

    let Option1 = useRef(null);
    let Option2 = useRef(null);
    let option_array = [Option1, Option2];

    const handleSelect = (option) => {
        if (!isSubmitted) {
            setSelectedOption(option);
        }
    }

    const handleSubmit = () => {
        if (selectedOption !== null && !isSubmitted) {
            setIsSubmitted(true);
            setLock(true);
            setShowPopup(true);
            if (selectedOption === Question.ans) {
                setScore(prev => prev + 1);
            } else {
                setShowRetry(true);
            }
        }
    }

    const handleRetry = () => {
        setLock(false);
        setShowRetry(false);
        setIsSubmitted(false);
        setSelectedOption(null);
    }

    const next = () => {
        if (index === data.length - 1) {
            setResult(true);
            if (onComplete) onComplete();
            return 0;
        }
        setIndex(prevIndex => prevIndex + 1);
        setQuestion(data[index + 1]);
        setLock(false);
        setIsSubmitted(false);
        setSelectedOption(null);
        setShowRetry(false);
    }

    const reset = () => {
        setIndex(0);
        setQuestion(data[0]);
        setScore(0);
        setLock(false);
        setResult(false);
        setSelectedOption(null);
        setIsSubmitted(false);
        setShowRetry(false);
    }

    return (
        <main className="app-frame">
            {/* Progress Bar */}
            <div className="progress-container">
                <div className="progress-track">
                    {data.map((_, i) => {
                        const isDone = i < index;
                        const isCurrent = i === index;
                        return (
                            <div key={i} className={`progress-step ${isDone ? 'done' : ''} ${isCurrent ? 'active' : ''}`}>
                                {isDone ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="content-area">
                {result ? (
                    <div className="result-section">
                        <h1>{score === data.length ? '🎉 완벽합니다! 🎉' : '학습 완료!'}</h1>
                        <p className="score-text">
                            {score === data.length
                                ? '모든 문제를 맞혔습니다! 대단해요.'
                                : `총 ${data.length}문제 중 ${score}문제를 맞혔습니다.`}
                        </p>
                        <div className="result-actions">
                            <button className="main-btn" onClick={reset}>다시 하기</button>
                            <button className="main-btn toc-btn" onClick={onReturnToList}>
                                목차로 이동
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="question-section">
                            <h2>{Question.question}</h2>
                        </div>

                        <div className="options-grid">
                            <button
                                className={`option-btn ${selectedOption === 1 ? 'selected' : ''} ${isSubmitted && Question.ans === 1 ? 'correct' : ''} ${isSubmitted && selectedOption === 1 && Question.ans !== 1 ? 'wrong' : ''}`}
                                onClick={() => handleSelect(1)}
                            >
                                O
                            </button>
                            <button
                                className={`option-btn ${selectedOption === 2 ? 'selected' : ''} ${isSubmitted && Question.ans === 2 ? 'correct' : ''} ${isSubmitted && selectedOption === 2 && Question.ans !== 2 ? 'wrong' : ''}`}
                                onClick={() => handleSelect(2)}
                            >
                                X
                            </button>
                        </div>

                        <div className="action-area">
                            {!isSubmitted ? (
                                <button
                                    className="main-btn submit-btn"
                                    onClick={handleSubmit}
                                    disabled={selectedOption === null}
                                >
                                    정답 제출
                                </button>
                            ) : (
                                <div className="result-actions">
                                    <button className="main-btn next-btn" onClick={next}>
                                        {index < data.length - 1 ? '다음 문제' : '목록으로 돌아가기'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Simple Popup Logic */}
            {showPopup && isSubmitted && showRetry && (
                <div className="popup-overlay">
                    <div className="popup-card">
                        <div className="popup-icon wrong">X</div>
                        <h3>오답입니다!</h3>
                        <button className="popup-btn" onClick={handleRetry}>다시 시도</button>
                    </div>
                </div>
            )}
            {showPopup && isSubmitted && !showRetry && selectedOption !== null && (
                <div className="popup-overlay">
                    <div className="popup-card">
                        <div className="popup-icon correct">✓</div>
                        <h3>정답입니다!</h3>
                        <button className="popup-btn" onClick={() => {
                            if (index === data.length - 1) {
                                setShowPopup(false);
                                if (onComplete) onComplete();
                                if (onReturnToList) onReturnToList();
                            } else {
                                next();
                            }
                        }}>
                            확인
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}
