import React from 'react';
import './TopicList.css';

export const TopicList = ({ topics, onSelectTopic }) => {
    return (
        <main className="app-frame list-frame">
            <header className="list-header-new">
                <h1 className="brand-logo">FORESTALL</h1>
                <p className="sub-logo">각 단계를 클릭하여 문제를 푸세요</p>
            </header>

            <div className="topic-list-container">
                {topics.map((topic) => (
                    <button
                        key={topic.id}
                        className={`topic-step-card ${topic.completed ? 'is-completed' : ''}`}
                        onClick={() => (topic.id === 'step-1' || topic.id === 'step-2' || topic.id === 'step-3' || topic.id === 'step-4') ? onSelectTopic(topic) : null}
                    >
                        <div className="card-accent-bar"></div>
                        <div className="card-content">
                            <div className="card-top">
                                <span className="step-label">{topic.step}</span>
                                {topic.completed && <span className="status-label">완료</span>}
                            </div>
                            <h2 className="step-title">{topic.title}</h2>
                        </div>
                    </button>
                ))}

            </div>

            <div className="bottom-pill-container">
                <div className="decorative-pill"></div>
            </div>
        </main>
    );
};
