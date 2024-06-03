// App.js
import React, { useState, useEffect } from 'react';
import QuestionList from './QuestionList';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    prompt: '',
    answers: ['', '', ''],
    correctIndex: 0,
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:4000/questions');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setQuestions([...questions, data]);
      setFormData({
        prompt: '',
        answers: ['', '', ''],
        correctIndex: 0,
      });
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/questions/${id}`, {
        method: 'DELETE',
      });
      setQuestions(questions.filter((question) => question.id !== id));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleCorrectAnswerChange = async (id, correctIndex) => {
    try {
      await fetch(`http://localhost:4000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correctIndex }),
      });
      setQuestions(
        questions.map((question) =>
          question.id === id ? { ...question, correctIndex } : question
        )
      );
    } catch (error) {
      console.error('Error updating correct answer:', error);
    }
  };

  return (
    <div>
      <QuestionList
        questions={questions}
        onDelete={handleDelete}
        onCorrectAnswerChange={handleCorrectAnswerChange}
      />
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            value={formData.prompt}
            onChange={(e) =>
              setFormData({ ...formData, prompt: e.target.value })
            }
          />
        </label>
        <label>
          Answer 1:
          <input
            type="text"
            value={formData.answers[0]}
            onChange={(e) =>
              setFormData({
                ...formData,
                answers: [e.target.value, formData.answers[1], formData.answers[2]],
              })
            }
          />
        </label>
        <label>
          Answer 2:
          <input
            type="text"
            value={formData.answers[1]}
            onChange={(e) =>
              setFormData({
                ...formData,
                answers: [formData.answers[0], e.target.value, formData.answers[2]],
              })
            }
          />
        </label>
        <label>
          Answer 3:
          <input
            type="text"
            value={formData.answers[2]}
            onChange={(e) =>
              setFormData({
                ...formData,
                answers: [formData.answers[0], formData.answers[1], e.target.value],
              })
            }
          />
        </label>
        <label>
          Correct Answer:
          <select
            value={formData.correctIndex}
            onChange={(e) => setFormData({ ...formData, correctIndex: e.target.value })}
          >
            {formData.answers.map((answer, index) => (
              <option key={index} value={index}>
                {answer}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Add Question</button>
      </form>
    </div>
  );
};

export default App;


