"use client";

import { useState } from "react";

type Question = {
  part1: string;
  part2: string;
  part3: string;
  options: string[];
  correctAnswers: string[];
};

const questions: Question[] = [
  {
    part1: "작업대에서는",
    part2: "및",
    part3: "착용해야 합니다.",
    options: ["안전모", "안전대", "형광펜", "형광조끼", "응원봉"],
    correctAnswers: ["안전모", "안전대"]
  },
  {
    part1: "밀폐작업 전",
    part2: "농도를 측정하고",
    part3: "설비를 가동해야 합니다.",
    options: ["산소", "먼지", "조명", "소음", "환기"],
    correctAnswers: ["산소", "환기"]
  },
  {
    part1: "화재 발생 시",
    part2: "를 누르고",
    part3: "으로 대피합니다.",
    options: ["비상벨", "엘리베이터", "비상계단", "소화기", "친구"],
    correctAnswers: ["비상벨", "비상계단"]
  },
  {
    part1: "감전사고 예방을 위해",
    part2: "보호구를 착용하고",
    part3: "상태를 점검합니다.",
    options: ["절연", "방수", "접지", "도체", "보온"],
    correctAnswers: ["절연", "접지"]
  },
  {
    part1: "지게차 운전 시 반드시",
    part2: "착용하고",
    part3: "를 지켜야 합니다.",
    options: ["안전벨트", "넥타이", "제한속도", "음악", "안전화"],
    correctAnswers: ["안전벨트", "제한속도"]
  }
];

export default function MultipleChoiceFillBlankQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([null, null]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // Helper to place chosen option into the next available blank
  const handleSelectOption = (option: string) => {
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
  const handleClearBlank = (index: number) => {
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
      setQuizFinished(true);
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
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-[#e8e6e6] flex flex-col items-center p-0 font-sans text-black">
        <main className="w-full max-w-md bg-white flex flex-col min-h-screen relative overflow-hidden shadow-2xl justify-center items-center p-8 text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            학습 완료!
          </h1>
          <p className="text-2xl font-medium">
            총 {questions.length}문제 중 <span className="text-blue-500 font-bold">{score}</span>문제를 맞혔습니다.
          </p>
          <button
            onClick={handleRestart}
            className="mt-8 px-8 py-4 rounded-xl font-bold text-xl tracking-widest transition-transform active:scale-95 shadow-[0_4px_14px_rgba(0,0,0,0.3)] bg-gradient-to-r from-[#8bede8] via-[#a8c3f5] to-[#d7b2fb]"
          >
            다시 하기
          </button>
        </main>
      </div>
    );
  }

  // Prevents rendering issues
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-[#e8e6e6] flex flex-col items-center p-0 font-sans text-black">
      {/* Phone frame wrapper to simulate app view */}
      <main className="w-full max-w-md bg-white flex flex-col min-h-screen relative overflow-hidden shadow-2xl">

        {/* Top Header Placeholder */}
        <div className="h-12 bg-[#ebebeb] w-full" />

        {/* Progress Bar Container */}
        <div className="w-full px-8 mt-10">
          <div className="relative flex items-center justify-between w-full h-8 px-[8%] before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:w-full before:h-4 before:bg-gradient-to-r before:from-[#c5fcd1] before:via-[#c8e6fd] before:to-[#8ebcfb] before:rounded-full before:z-0">
            {questions.map((_, index) => {
              const isActive = index <= currentQuestionIndex;
              return (
                <div
                  key={index}
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center -ml-2 first:ml-0 transition-colors ${isActive ? 'bg-white/60' : 'bg-white/20'
                    }`}
                >
                  <div className={`w-7 h-7 rounded-full bg-transparent border-2 flex items-center justify-center transition-colors ${isActive ? 'border-black/60 text-black/80' : 'border-black/10 text-transparent'
                    }`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Section */}
        <div className="flex-1 flex flex-col items-center mt-12 px-6">
          <div className="text-2xl font-bold space-y-4 text-center tracking-tight leading-loose">
            <div>{currentQuestion.part1}</div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleClearBlank(0)}
                className={`
                  w-28 h-10 border border-black/30 bg-white font-normal text-xl focus:outline-none transition-all flex items-center justify-center
                  ${isSubmitted
                    ? answers[0] === currentQuestion.correctAnswers[0] ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'
                    : ''
                  }
                `}
              >
                {answers[0] || ""}
              </button>

              <span className="font-bold">{currentQuestion.part2}</span>

              <button
                onClick={() => handleClearBlank(1)}
                className={`
                  w-28 h-10 border border-black/30 bg-white font-normal text-xl focus:outline-none transition-all flex items-center justify-center
                  ${isSubmitted
                    ? answers[1] === currentQuestion.correctAnswers[1] ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'
                    : ''
                  }
                `}
              >
                {answers[1] || ""}
              </button>
            </div>

            <div>{currentQuestion.part3}</div>
          </div>

          {/* Result message if submitted */}
          {isSubmitted && (
            <div className="mt-8 text-xl font-bold flex flex-col items-center gap-2">
              {isCorrect ? (
                <span className="text-green-600">정답입니다!</span>
              ) : (
                <div className="text-center">
                  <span className="text-red-500 block mb-2">오답입니다!</span>
                  <span className="text-zinc-500 text-base font-medium">정답: {currentQuestion.correctAnswers[0]}, {currentQuestion.correctAnswers[1]}</span>
                </div>
              )}
            </div>
          )}

          {/* Options Grid */}
          <div className="mt-12 w-full flex flex-col gap-6 items-center">
            {/* Top row */}
            <div className="flex justify-center gap-6 w-full px-4">
              <button
                onClick={() => handleSelectOption(currentQuestion.options[0])}
                disabled={answers.includes(currentQuestion.options[0]) || isSubmitted}
                className="w-36 py-3 rounded-full font-bold text-xl transition-transform active:scale-95 disabled:opacity-50
                bg-gradient-to-r from-[#a3e6eb] via-[#bfacef] to-[#ceabfc] shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center justify-center"
              >
                {currentQuestion.options[0]}
              </button>
              <button
                onClick={() => handleSelectOption(currentQuestion.options[1])}
                disabled={answers.includes(currentQuestion.options[1]) || isSubmitted}
                className="w-36 py-3 rounded-full font-bold text-xl transition-transform active:scale-95 disabled:opacity-50
                bg-gradient-to-r from-[#a3e6eb] via-[#bfacef] to-[#ceabfc] shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center justify-center"
              >
                {currentQuestion.options[1]}
              </button>
            </div>

            {/* Middle row */}
            <div className="flex justify-center gap-6 w-full px-4">
              <button
                onClick={() => handleSelectOption(currentQuestion.options[2])}
                disabled={answers.includes(currentQuestion.options[2]) || isSubmitted}
                className="w-36 py-3 rounded-full font-bold text-xl transition-transform active:scale-95 disabled:opacity-50
                bg-gradient-to-r from-[#a3e6eb] via-[#bfacef] to-[#ceabfc] shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center justify-center"
              >
                {currentQuestion.options[2]}
              </button>
              <button
                onClick={() => handleSelectOption(currentQuestion.options[3])}
                disabled={answers.includes(currentQuestion.options[3]) || isSubmitted}
                className="w-36 py-3 rounded-full font-bold text-xl transition-transform active:scale-95 disabled:opacity-50
                bg-gradient-to-r from-[#a3e6eb] via-[#bfacef] to-[#ceabfc] shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center justify-center"
              >
                {currentQuestion.options[3]}
              </button>
            </div>

            {/* Bottom row */}
            <div className="flex justify-center w-full px-4">
              <button
                onClick={() => handleSelectOption(currentQuestion.options[4])}
                disabled={answers.includes(currentQuestion.options[4]) || isSubmitted}
                className="w-36 py-3 rounded-full font-bold text-xl transition-transform active:scale-95 disabled:opacity-50
                bg-gradient-to-r from-[#a3e6eb] via-[#bfacef] to-[#ceabfc] shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center justify-center"
              >
                {currentQuestion.options[4]}
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full flex justify-center pb-12 pt-6 shrink-0">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!answers[0] || !answers[1]}
              className={`
                w-64 py-4 rounded-xl font-bold text-2xl tracking-widest transition-transform
                shadow-[0_4px_14px_rgba(0,0,0,0.3)]
                ${(!answers[0] || !answers[1]) ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}
                bg-gradient-to-r from-[#8bede8] via-[#a8c3f5] to-[#d7b2fb]
              `}
            >
              정답 제출
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-64 py-4 rounded-xl font-bold text-2xl tracking-widest transition-transform active:scale-95 shadow-[0_4px_14px_rgba(0,0,0,0.3)] bg-gradient-to-r from-[#8bede8] via-[#a8c3f5] to-[#d7b2fb]"
            >
              {currentQuestionIndex < questions.length - 1 ? '다음 문제' : '결과 보기'}
            </button>
          )}
        </div>

      </main>

      {/* Pop-up Overlay */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-xs bg-white rounded-3xl shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-300 flex flex-col items-center p-8 text-center space-y-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
              {isCorrect ? (
                <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            <div className="space-y-2">
              <h2 className={`text-3xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                {isCorrect ? '정답입니다!' : '오답입니다!'}
              </h2>
              {!isCorrect && (
                <p className="text-zinc-500 font-medium">
                  정답: <span className="text-black">{currentQuestion.correctAnswers[0]}, {currentQuestion.correctAnswers[1]}</span>
                </p>
              )}
            </div>

            <button
              onClick={isCorrect ? () => setShowPopup(false) : handleRetry}
              className="w-full py-4 rounded-xl font-bold text-xl tracking-widest transition-transform active:scale-95 shadow-[0_4px_14px_rgba(0,0,0,0.2)] bg-gradient-to-r from-[#8bede8] via-[#a8c3f5] to-[#d7b2fb]"
            >
              {isCorrect ? '확인' : '다시 시도'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
