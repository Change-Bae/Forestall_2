import React, { useState } from 'react';
import { Volume2, Check } from 'lucide-react';
import './ConceptMatch.css';

const STAGES = [
    {
        title: "1단계: 개념-단어 연결 짓기",
        data: [
            { id: 1, word: "단부.개구부", audioDesc: "낭떠러지나 바닥에 뚫린 구멍을 의미합니다." },
            { id: 2, word: "철골 공사", audioDesc: "강재를 사용하여 건물의 뼈대를 만드는 작업입니다." },
            { id: 3, word: "지붕 공사", audioDesc: "건물의 최상부 덮개를 설치하는 작업입니다." },
            { id: 4, word: "비계.작업발판", audioDesc: "높은 곳에서 작업할 수 있도록 설치하는 가설물입니다." },
            { id: 5, word: "사다리", audioDesc: "높은 곳으로 오르내릴 때 사용하는 도구입니다." },
        ]
    },
    {
        title: "1단계: 개념-단어 연결 짓기",
        data: [
            { id: 1, word: "a", audioDesc: "a" },
            { id: 2, word: "b", audioDesc: "b" },
            { id: 3, word: "c", audioDesc: "c" },
            { id: 4, word: "d", audioDesc: "d" },
            { id: 5, word: "e", audioDesc: "e" },
        ]
    },
    {
        title: "1단계: 개념-단어 연결 짓기",
        data: [
            { id: 1, word: "ㄱ", audioDesc: "ㄱ" },
            { id: 2, word: "ㄴ", audioDesc: "ㄴ" },
            { id: 3, word: "ㄷ", audioDesc: "ㄷ" },
            { id: 4, word: "ㄹ", audioDesc: "ㄹ" },
            { id: 5, word: "ㅁ", audioDesc: "ㅁ" },
        ]
    },
    {
        title: "1단계: 개념-단어 연결 짓기",
        data: [
            { id: 1, word: "1", audioDesc: "1" },
            { id: 2, word: "2", audioDesc: "2" },
            { id: 3, word: "3", audioDesc: "3" },
            { id: 4, word: "4", audioDesc: "4" },
            { id: 5, word: "5", audioDesc: "5" },
        ]
    }
];

export const ConceptMatch = ({ onComplete, onReturnToList }) => {
    const [currentStage, setCurrentStage] = useState(0);
    const [selectedAudioId, setSelectedAudioId] = useState(null);
    const [matches, setMatches] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const stageInfo = STAGES[currentStage];
    const items = stageInfo.data;

    const handleAudioClick = (id) => {
        if (submitted) return;

        if (matches[id] && !submitted) {
            setSelectedAudioId(id);
        } else {
            setSelectedAudioId(id);
        }

        window.speechSynthesis.cancel();
        const targetItem = items.find(item => item.id === id);
        if (targetItem) {
            const utterance = new SpeechSynthesisUtterance(targetItem.audioDesc);
            utterance.lang = 'ko-KR';
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleWordClick = (wordId) => {
        if (!selectedAudioId || submitted) return;

        const newMatches = { ...matches };
        const prevAudioId = Object.keys(newMatches).find(key => newMatches[key] === wordId);
        if (prevAudioId) {
            delete newMatches[prevAudioId];
        }

        newMatches[selectedAudioId] = wordId;
        setMatches(newMatches);
        setSelectedAudioId(null);
    };

    const handleSubmit = () => {
        const totalCount = items.length;
        const matchedCount = Object.keys(matches).length;

        if (matchedCount < totalCount) {
            alert("모든 음성 버튼과 단어 버튼을 연결해주세요.");
            return;
        }

        let correctCount = 0;
        items.forEach(item => {
            if (matches[item.id] === item.id) correctCount++;
        });

        setSubmitted(true);
        setIsCorrect(correctCount === totalCount);
    };

    const handleReset = () => {
        setMatches({});
        setSubmitted(false);
        setIsCorrect(false);
        setSelectedAudioId(null);
    };

    const handleNextStage = () => {
        if (currentStage < STAGES.length - 1) {
            setCurrentStage(currentStage + 1);
            handleReset();
        } else {
            if (onComplete) onComplete();
            if (onReturnToList) onReturnToList();
        }
    };

    const getButtonClass = (id, type) => {
        if (type === 'audio') {
            if (submitted) {
                return matches[id] === id ? 'btn-status-correct' : 'btn-status-wrong';
            }
            if (selectedAudioId === id) return 'btn-status-matched';
            if (matches[id]) return 'btn-status-matched';
            return 'btn-status-default';
        } else {
            const audioId = Object.keys(matches).find(key => matches[key] === id);
            if (submitted) {
                if (!audioId) return 'btn-status-default';
                return parseInt(audioId) === id ? 'btn-status-correct' : 'btn-status-wrong';
            }
            if (audioId) return 'btn-status-matched';
            return 'btn-status-default';
        }
    };

    return (
        <div className="concept-match-container container">
            <div className="progress-container">
                <div className="progress-track">
                    <div
                        className="progress-line-active"
                        style={{ width: `${(currentStage / (4 - 1)) * 100}%` }}
                    />
                    <div className="progress-steps-wrapper">
                        {[1, 2, 3, 4].map((step) => {
                            const isActive = currentStage + 1 >= step;
                            const isCompleted = currentStage + 1 > step || (currentStage + 1 === step && isCorrect);

                            return (
                                <div key={step} className={`progress-step ${isActive ? 'active' : ''}`}>
                                    {isCompleted && <Check size={18} color="#3b3b3b" />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="header">
                <h2>{stageInfo.title}</h2>
                <p className="subtitle">개념에 해당하는 단어를 선택하세요.</p>
            </div>

            <div className="quiz-section">
                {items.map(item => {
                    const linkedWordId = matches[item.id];
                    const linkedAudioId = Object.keys(matches).find(key => matches[key] === item.id);

                    return (
                        <div className="row" key={`row-${item.id}`}>
                            <div className="button-wrapper">
                                <button className={`btn-audio ${getButtonClass(item.id, 'audio')}`} onClick={() => handleAudioClick(item.id)}>
                                    <div className="audio-icon-wrapper">
                                        <Volume2 size={30} strokeWidth={2.5} />
                                        <div className="sound-wave">
                                            <span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
                                        </div>
                                    </div>
                                </button>
                                {linkedWordId && (
                                    <span className="connect-label">{linkedWordId}번 단어와 연결</span>
                                )}
                            </div>

                            <div className="button-wrapper">
                                <button className={`btn-word ${getButtonClass(item.id, 'word')}`} onClick={() => handleWordClick(item.id)}>
                                    {item.word}
                                </button>
                                {linkedAudioId && (
                                    <span className="connect-label">음성 {linkedAudioId}와 연결</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="footer">
                {!submitted ? (
                    <button className="bottom-btn submit" onClick={handleSubmit}>정답 제출</button>
                ) : (
                    !isCorrect ? (
                        <button className="bottom-btn reset" onClick={handleReset}>다시 풀기</button>
                    ) : (
                        <button className="bottom-btn next" onClick={handleNextStage}>
                            {currentStage < STAGES.length - 1 ? "다음 문제" : "목록으로 돌아가기"}
                        </button>
                    )
                )}
            </div>
        </div>
    );
}
