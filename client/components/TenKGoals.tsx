// File will focus on the user learning a new skill
// The goal is to help the user set aside hours in their week to learn a new skill and track their progress
// Tracking their progress done entirely by user input, rating themselves?
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TenKGoals() {
  return (
    <div>
      <div>
        <h1>TenK Goals</h1>
        <p>Track your progress in learning a new skill.</p>
      </div>
      <div>
        <p>Set aside hours in your week to focus on learning your new skill and rate your progress regularly.</p>
        <input type="number" placeholder="Hours per week" />
        <button>Save</button>
        <a href="#">Plan with Routine</a>
        <p>Add subject, or appoint subject type</p>
        <button>Appoint</button>
      </div>
      <div>
        <p>Track your weekly progress here.</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[{ week: 'Week 1', progress: 3 }, { week: 'Week 2', progress: 5 }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="progress" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}