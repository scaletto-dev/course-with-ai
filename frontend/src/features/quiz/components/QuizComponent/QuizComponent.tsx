import { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, Shuffle } from 'lucide-react';
import type { Quiz } from '@/features/quiz/types';

interface QuizProps {
  quiz: Quiz;
}

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to create shuffled quiz
function createShuffledQuiz(originalQuiz: Quiz): Quiz {
  const shuffledQuestions = originalQuiz.questions.map((question) => ({
    ...question,
    options: shuffleArray([...question.options]),
    // Recalculate correctAnswer index based on new option order
    correctAnswer: shuffleArray([...question.options]).indexOf(
      question.options[question.correctAnswer]
    ),
  }));

  return {
    ...originalQuiz,
    questions: shuffledQuestions,
  };
}

export function QuizComponent({ quiz }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(quiz.questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [shuffledQuiz, setShuffledQuiz] = useState<Quiz>(quiz);

  const currentQuestion = shuffledQuiz.questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleSelectAnswer = (optionIndex: number) => {
    if (!showResults) {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestionIndex] = optionIndex;
      setSelectedAnswers(newAnswers);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowResults(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowResults(false);
    }
  };

  const handleSubmitAnswer = () => {
    setShowResults(true);
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(shuffledQuiz.questions.length).fill(null));
    setShowResults(false);
  };

  const handleGenerateQuiz = () => {
    const newShuffledQuiz = createShuffledQuiz(quiz);
    setShuffledQuiz(newShuffledQuiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(quiz.questions.length).fill(null));
    setShowResults(false);
  };

  const correctCount = selectedAnswers.filter(
    (answer, index) => answer === shuffledQuiz.questions[index].correctAnswer
  ).length;

  const progressPercentage = ((currentQuestionIndex + 1) / shuffledQuiz.questions.length) * 100;

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </h3>
          <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === currentQuestion.correctAnswer;
            let optionClassName = 'p-4 border-2 rounded-lg cursor-pointer transition-all';

            if (showResults) {
              if (isCorrectOption) {
                optionClassName += ' border-green-500 bg-green-50';
              } else if (isSelected && !isCorrectOption) {
                optionClassName += ' border-red-500 bg-red-50';
              } else {
                optionClassName += ' border-gray-200 bg-gray-50';
              }
            } else {
              optionClassName += isSelected
                ? ' border-blue-500 bg-blue-50'
                : ' border-gray-200 hover:border-gray-300';
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showResults}
                className={optionClassName}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      showResults
                        ? isCorrectOption
                          ? 'border-green-500 bg-green-500'
                          : isSelected && !isCorrectOption
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                        : isSelected
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                    }`}
                  >
                    {showResults && isCorrectOption && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                    {showResults && isSelected && !isCorrectOption && (
                      <XCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation (shown after answer) */}
      {showResults && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            isAnswerCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {isAnswerCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={`font-semibold mb-2 ${
                  isAnswerCorrect ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {isAnswerCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              <p className={isAnswerCorrect ? 'text-green-800' : 'text-red-800'}>
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="flex gap-3">
          {!showResults && (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Answer
            </button>
          )}

          {showResults &&
            currentQuestionIndex === shuffledQuiz.questions.length - 1 && (
              <button
                onClick={handleResetQuiz}
                className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </button>
            )}

          {showResults &&
            currentQuestionIndex === shuffledQuiz.questions.length - 1 && (
              <button
                onClick={handleGenerateQuiz}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Shuffle className="w-4 h-4" />
                New Quiz
              </button>
            )}

          {showResults && currentQuestionIndex < shuffledQuiz.questions.length - 1 && (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Results Summary (shown at the end) */}
      {showResults && currentQuestionIndex === shuffledQuiz.questions.length - 1 && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Results</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Correct Answers</p>
              <p className="text-3xl font-bold text-green-600">
                {correctCount}/{shuffledQuiz.questions.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Score</p>
              <p
                className={`text-3xl font-bold ${
                  (correctCount / shuffledQuiz.questions.length) * 100 >=
                  quiz.passingScore
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {Math.round((correctCount / shuffledQuiz.questions.length) * 100)}%
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Status</p>
            <p
              className={`text-lg font-semibold ${
                (correctCount / shuffledQuiz.questions.length) * 100 >=
                quiz.passingScore
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {(correctCount / shuffledQuiz.questions.length) * 100 >=
              quiz.passingScore
                ? '✓ Passed'
                : '✗ Failed'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
