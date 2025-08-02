import React, { useState } from 'react';
import styles from './StepBehavioral.module.css';

const questions = [
  {
    type: 'single',
    question: 'How does your child prefer to solve problems?',
    options: [
      'Drawing or visualizing the problem',
      'Talking through the steps',
      'Trial and error through experimentation',
      'Following a structured plan'
    ]
  },
  {
    type: 'single',
    question: 'How does your child react when faced with a challenge?',
    options: [
      'Gets frustrated and may give up',
      'Tries different approaches to solve the problem',
      'Seeks help from others',
      'Stays calm and works through it'
    ]
  },
  {
    type: 'single',
    question: 'What motivates your child to complete tasks?',
    options: [
      'Earning rewards or badges',
      'Praise and recognition',
      'Completing challenges or competing with others',
      'Knowing the purpose or outcome of the task'
    ]
  },
  {
    type: 'multiple',
    question: 'What type of activities does your child enjoy the most?',
    options: [
      'Watching videos or learning through visuals',
      'Listening to stories, songs, or verbal instructions',
      'Hands-on activities like building, crafting, or experiments',
      'Reading books or written instructions',
      'Playing strategy games or solving riddles'
    ]
  },
  {
    type: 'multiple',
    question: 'What type of game elements does your child enjoy most?',
    options: [
      'Competing with others in challenges',
      'Exploring open worlds and finding hidden items',
      'Building or creating new structures/ideas',
      'Collecting items or rewards',
      'Role-playing or choosing characters with unique skills'
    ]
  },
  {
    type: 'multiple',
    question: 'Does your child exhibit any of the following behaviors?',
    options: [
      'Difficulty staying focused on tasks',
      'Struggles with regulating emotions (e.g., anger or frustration)',
      'Anxiety in social or challenging situations',
      'Tendency to avoid group activities or social interactions',
      'Impulsivity or acting without thinking'
    ]
  },
  {
    type: 'multiple',
    question: 'What skills do you want your child to develop through this app?',
    options: [
      'Improving focus and attention',
      'Developing social and emotional skills',
      'Boosting creativity and imagination',
      'Strengthening math or language skills',
      'Learning problem-solving strategies'
    ]
  },
  {
    type: 'multiple',
    question: 'Are there specific emotional areas where your child needs support?',
    options: [
      'Building self-confidence',
      'Managing stress or anxiety',
      'Improving patience and focus',
      'Handling social interactions',
      'Controlling anger or frustration'
    ]
  }
];

const StepBehavioral = ({ onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionSelect = (option) => {
    if (questions[currentQuestion].type === 'single') {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: [option]
      }));
      if (currentQuestion === questions.length - 1) {
        onSubmit({ ...answers, [currentQuestion]: [option] });
      } else {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOptions([]);
      }
    } else {
      setSelectedOptions(prev => 
        prev.includes(option)
          ? prev.filter(item => item !== option)
          : [...prev, option]
      );
    }
  };

  const handleNext = () => {
    if (selectedOptions.length === 0) return;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: selectedOptions
    }));

    if (currentQuestion === questions.length - 1) {
      onSubmit(answers);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOptions([]);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className={styles.questionCount}>
        Question {currentQuestion + 1} of {questions.length}
      </div>
      
      <h3 className={styles.question}>{currentQ.question}</h3>
      <div className={styles.options}>
        {currentQ.options.map((option, index) => (
          <div 
            key={index} 
            onClick={() => handleOptionSelect(option)}
            className={`${styles.optionLabel} ${
              selectedOptions.includes(option) ? styles.selected : ''
            }`}
          >
            {currentQ.type === 'multiple' && (
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => {}}
                className={styles.optionInput}
              />
            )}
            <span className={styles.optionText}>{option}</span>
          </div>
        ))}
      </div>
      
      {currentQ.type === 'multiple' && (
        <button
          onClick={handleNext}
          disabled={selectedOptions.length === 0}
          className={styles.nextButton}
        >
          {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
        </button>
      )}
    </div>
  );
};

export default StepBehavioral;
