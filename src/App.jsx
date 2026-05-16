import React, { useState } from 'react';
import './App.css';

function App() {
  const [page, setPage] = useState(1);
  const [dob, setDob] = useState('');
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('한국어');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form is valid if DOB is exactly 6 digits and name is not empty
  const isFormValid = dob.length === 6 && name.trim().length > 0;

  const handleStartClick = () => {
    if (isFormValid) {
      setPage(2);
    }
  };

  // DB에 저장하는 함수
  const handleConfirm = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthdate: dob, language })
      });
      const data = await res.json();
      console.log(data.message);
      setPage(3); // DB 저장 후 3페이지로 이동
    } catch (err) {
      console.error('저장 실패:', err);
      setError('서버 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* PAGE 1 */}
      {page === 1 && (
        <div className="page page1">
          <h1 className="logo pixel-font">FORESTALL</h1>

          <div className="input-group">
            <input
              type="text"
              placeholder="생년월일 6자리를 입력해주세요"
              value={dob}
              maxLength={6}
              onChange={(e) => setDob(e.target.value.replace(/[^0-9]/g, ''))}
            />
            <input
              type="text"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="select-wrapper">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="한국어">한국어</option>
                <option value="영어">영어</option>
                <option value="중국어">중국어</option>
              </select>
            </div>
          </div>

          <button
            className={`start-btn ${isFormValid ? 'active' : 'disabled'}`}
            onClick={handleStartClick}
            disabled={!isFormValid}
          >
            시작
          </button>
        </div>
      )}

      {/* PAGE 2 */}
      {page === 2 && (
        <div className="page page2">
          <h1 className="logo pixel-font">FORESTALL</h1>

          <div className="modal-container">
            <div className="modal-header">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div className="modal-content">
              <p className="confirm-text">
                {dob} {name} {language} 가 맞습니까?
              </p>
              <p className="sub-text">
                이수증 발급 시 본인 확인용으로 사용되므로<br />올바르게 작성해주세요!
              </p>
              {error && (
                <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '8px' }}>
                  {error}
                </p>
              )}
              <div className="modal-actions">
                <button
                  className="pixel-btn cancel"
                  onClick={() => setPage(1)}
                  disabled={isLoading}
                >
                  ❌
                </button>
                <button
                  className="pixel-btn confirm"
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? '저장 중...' : '✅'}
                </button>
              </div>
            </div>
          </div>

          <button className="start-btn disabled" disabled style={{ opacity: 0.5 }}>
            시작
          </button>
        </div>
      )}

      {/* PAGE 3 */}
      {page === 3 && (
        <div className="page page3">
          <h1 className="logo pixel-font">FORESTALL</h1>
          <p className="subtitle pixel-font">각 단계를 클릭하여 문제를 푸세요</p>

          <div className="steps-container">
            <div className="step-btn">
              <span className="step-num">1단계</span>
              <span className="step-title">개념-단어 연결 짓기</span>
            </div>
            <div className="step-btn">
              <span className="step-num">2단계</span>
              <span className="step-title">장비-용도 알아가기</span>
            </div>
            <div className="step-btn">
              <span className="step-num">3단계</span>
              <span className="step-title">돌발! OX 퀴즈 맞추기</span>
            </div>
            <div className="step-btn">
              <span className="step-num">4단계</span>
              <span className="step-title">빈칸을 채워보자!</span>
            </div>
          </div>

          <div className="bottom-pill"></div>
        </div>
      )}
    </div>
  );
}

export default App;