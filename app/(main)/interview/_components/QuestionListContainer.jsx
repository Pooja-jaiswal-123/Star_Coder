import React from "react";

const QuestionListContainer = ({ questionlist }) => {
  return (
    <div>
      <h3 className="font-bold text-lg mb-3 text-primary">
        Generated Interview Questions:
      </h3>

      {questionlist?.map((item, index) => (
        <div key={index} className="border-b py-3 text-sm">
          <strong>{index + 1}.</strong> {item.question}
          <p className="text-primary text-xs mt-1 font-medium">{item.type}</p>
        </div>
      ))}

      {(!questionlist || questionlist.length === 0) && (
        <p className="text-sm text-gray-500">No questions generated yet.</p>
      )}
    </div>
  );
};

export default QuestionListContainer;
