import React, { useState, useEffect } from "react";
import CustomizableProgressBar from "./ProgressBar";
import "./App.css";

interface Milestone {
  label: string;
  amount: number;
}

interface ProgressData {
  currentAmount: number;
  barMax: number;
  milestones: Milestone[];
  target?: number;
}

const INITIAL_PROGRESS_DATA: ProgressData = {
  currentAmount: 0,
  barMax: 100,
  milestones: [],
  target: undefined,
};

const INITIAL_NEW_MILESTONE: Milestone = {
  label: "",
  amount: 0,
};

const App: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressData>(
    INITIAL_PROGRESS_DATA
  );
  const [newMilestone, setNewMilestone] = useState<Milestone>(
    INITIAL_NEW_MILESTONE
  );
  const [showK, setShowK] = useState(true);

  useEffect(() => {
    // Reset to initial values on component mount (page refresh)
    setProgressData(INITIAL_PROGRESS_DATA);
    setNewMilestone(INITIAL_NEW_MILESTONE);
    setShowK(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProgressData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : parseFloat(value),
    }));
  };

  const handleAddMilestone = () => {
    if (newMilestone.label && newMilestone.amount) {
      setProgressData((prev) => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone].sort(
          (a, b) => a.amount - b.amount
        ),
      }));
      setNewMilestone(INITIAL_NEW_MILESTONE);
    }
  };

  const handleRemoveMilestone = (index: number) => {
    setProgressData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="app-title">Progress Bar Demo</h1>
        <div className="form-container">
          <div className="input-group">
            <label htmlFor="currentAmount">Current Amount:</label>
            <input
              type="number"
              id="currentAmount"
              name="currentAmount"
              value={progressData.currentAmount || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="target">Target:</label>
            <input
              type="number"
              id="target"
              name="target"
              value={progressData.target || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="barMax">Bar Max:</label>
            <input
              type="number"
              id="barMax"
              name="barMax"
              value={progressData.barMax || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="toggle-container">
          <label htmlFor="showK">Show amounts in thousands (k):</label>
          <input
            type="checkbox"
            id="showK"
            checked={showK}
            onChange={() => setShowK(!showK)}
          />
        </div>
        <div className="milestones-container">
          <h2>Milestones</h2>
          <div className="milestones-list">
            {progressData.milestones.map((milestone, index) => (
              <div key={index} className="milestone-item">
                <span>
                  {milestone.label}: {milestone.amount}
                  {showK ? "k" : ""}
                </span>
                <button onClick={() => handleRemoveMilestone(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="add-milestone-form">
            <input
              type="text"
              value={newMilestone.label}
              onChange={(e) =>
                setNewMilestone((prev) => ({ ...prev, label: e.target.value }))
              }
              placeholder="Milestone Label"
            />
            <input
              type="number"
              value={newMilestone.amount || ""}
              onChange={(e) =>
                setNewMilestone((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value) || 0,
                }))
              }
              placeholder="Milestone Amount"
            />
            <button onClick={handleAddMilestone}>Add Milestone</button>
          </div>
        </div>
        <div className="progress-bar-container">
          <CustomizableProgressBar data={progressData} showK={showK} />
        </div>
      </div>
    </div>
  );
};

export default App;
